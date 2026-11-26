<?php
/** Generate a certificate as PDF (with or without QR code) + download its QR code. */

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/_layout.php';
require_once __DIR__ . '/_cert.php';
require_login();

$id = (int) ($_GET['id'] ?? 0);
$row = null;
if ($id) {
    $stmt = db()->prepare('SELECT * FROM certificates WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch() ?: null;
}

// No certificate chosen → pick one from the latest
if (!$row) {
    $recent = db()->query('SELECT id, certificate_no, student_name, course, status FROM certificates ORDER BY id DESC LIMIT 50')->fetchAll();
    admin_header('Generate Certificate', 'generate');
    ?>
<div class="page-head">
  <div>
    <h1>Generate Certificate</h1>
    <p class="muted">Choose a certificate to generate its PDF and QR code. To create a new one, <a href="edit.php">add a certificate</a> first.</p>
  </div>
</div>
<?php if ($id): ?><div class="flash flash-error" role="alert">Certificate not found.</div><?php endif; ?>
<div class="card table-card">
  <?php if (!$recent): ?>
    <div class="empty"><p class="muted">No certificates yet.</p><a href="edit.php" class="btn btn-primary" style="margin-top:14px">Add Certificate</a></div>
  <?php else: ?>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Certificate No.</th><th>Name</th><th>Course</th><th>Status</th><th class="r"></th></tr></thead>
      <tbody>
      <?php foreach ($recent as $r): ?>
        <tr>
          <td class="mono"><?= e($r['certificate_no']) ?></td>
          <td><b><?= e($r['student_name']) ?></b></td>
          <td><?= e($r['course']) ?></td>
          <td><span class="badge badge-<?= e($r['status']) ?>"><?= e(ucfirst($r['status'])) ?></span></td>
          <td class="r"><?php if ($r['status'] === 'active'): ?><a class="btn btn-sm btn-primary" href="certificate.php?id=<?= (int) $r['id'] ?>">Generate</a><?php else: ?><span class="muted small">Not available</span><?php endif; ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endif; ?>
</div>
<?php
    admin_footer();
    exit;
}

$data = cert_js_data($row);
$revoked = $row['status'] === 'revoked';
admin_header('Generate Certificate', 'generate');
?>
<div class="page-head">
  <div>
    <a href="dashboard.php" class="crumb">← All certificates</a>
    <h1>Generate Certificate</h1>
    <p class="muted"><span class="mono"><?= e($row['certificate_no']) ?></span> · <?= e($row['student_name']) ?> · <?= e($row['course']) ?></p>
  </div>
  <a href="edit.php?id=<?= (int) $row['id'] ?>" class="btn btn-ghost">Edit Details</a>
</div>

<?php if ($revoked): ?>
  <div class="flash flash-error" role="alert">This certificate is <b>revoked</b>. Change its status to Active to generate a PDF.</div>
<?php endif; ?>

<div class="gen">
  <div class="gen-sheet">
    <?php cert_sheet('cert'); ?>
  </div>

  <div class="gen-side">
    <div class="card gen-card">
      <h3 class="section-title"><span class="step">1</span> QR Code</h3>
      <div class="seg" role="radiogroup" aria-label="QR code on certificate">
        <label><input type="radio" name="qr" value="1" checked> <span>With QR Code</span></label>
        <label><input type="radio" name="qr" value="0"> <span>Without QR Code</span></label>
      </div>
      <p class="muted small" id="qr-help">The QR code opens this certificate on the verification page.</p>

      <h3 class="section-title"><span class="step">2</span> Generate</h3>
      <div class="gen-actions">
        <button type="button" class="btn btn-primary btn-block" id="btn-pdf" <?= $revoked ? 'disabled' : '' ?>>⬇ Download PDF</button>
        <button type="button" class="btn btn-ghost btn-block" id="btn-open" <?= $revoked ? 'disabled' : '' ?>>Open PDF / Print</button>
      </div>
      <p class="gen-status" id="gen-status" role="status"></p>
    </div>

    <div class="card gen-card">
      <h3 class="section-title">Generated QR Code</h3>
      <div class="qr-out">
        <div class="qr-img" id="qr-img"></div>
        <div>
          <small class="muted block">Opens</small>
          <a id="qr-link" class="qr-link" target="_blank" rel="noopener"></a>
          <a id="qr-dl" class="btn btn-sm btn-ghost" style="margin-top:10px">Download QR (PNG)</a>
        </div>
      </div>
    </div>
  </div>
</div>

<?php cert_scripts(true); ?>
<script>
(() => {
  const data = <?= json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE) ?>;
  const url = MarkCert.verifyUrl(data.certificateNo);
  const sheet = document.getElementById('cert');
  const status = document.getElementById('gen-status');
  const withQr = () => document.querySelector('input[name="qr"]:checked').value === '1';

  // QR code is generated now, from the certificate number
  document.getElementById('qr-img').innerHTML = MarkCert.qrSvg(url);
  const link = document.getElementById('qr-link');
  link.href = url; link.textContent = url;
  const dl = document.getElementById('qr-dl');
  dl.href = MarkCert.qrPng(url); dl.download = `QR-${data.certificateNo}.png`;

  const draw = () => {
    MarkCert.render(sheet, data, { qrUrl: url, qr: withQr() });
    document.getElementById('qr-help').textContent = withQr()
      ? 'The QR code opens this certificate on the verification page.'
      : 'No QR code on the certificate. It can still be verified with the certificate number.';
  };
  document.querySelectorAll('input[name="qr"]').forEach((r) => r.addEventListener('change', draw));
  draw();

  async function make(action) {
    status.textContent = 'Generating PDF…';
    status.className = 'gen-status';
    try {
      const doc = await MarkCert.pdf(data, { qr: withQr() });
      const name = `Certificate-${data.certificateNo}${withQr() ? '' : '-without-QR'}.pdf`;
      if (action === 'open') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(name);
      }
      status.textContent = `✓ ${name} generated`;
      status.className = 'gen-status ok';
    } catch (err) {
      console.error(err);
      status.textContent = 'Could not generate the PDF. Please reload the page and try again.';
      status.className = 'gen-status bad';
    }
  }
  document.getElementById('btn-pdf').addEventListener('click', () => make('save'));
  document.getElementById('btn-open').addEventListener('click', () => make('open'));
})();
</script>

<?php admin_footer();
