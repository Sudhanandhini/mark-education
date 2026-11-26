<?php
/** Add (no id) or edit (?id=) a certificate. */

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/certificates.php';
require_once __DIR__ . '/_layout.php';
require_once __DIR__ . '/_cert.php';
require_login();

$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$errors = [];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM certificates WHERE id = ?');
    $stmt->execute([$id]);
    $data = $stmt->fetch();
    if (!$data) {
        flash('error', 'Certificate not found.');
        header('Location: dashboard.php');
        exit;
    }
} else {
    $data = blank_certificate();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    [$clean, $errors] = validate_certificate($_POST, $id);
    $data = array_merge($data, $clean);

    if (!$errors) {
        $cols = CERT_FIELDS;
        if ($id) {
            $set = implode(', ', array_map(fn($c) => "$c = ?", $cols));
            $stmt = db()->prepare("UPDATE certificates SET $set WHERE id = ?");
            $stmt->execute([...array_map(fn($c) => $clean[$c], $cols), $id]);
            flash('success', "Certificate {$clean['certificate_no']} updated.");
        } else {
            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $stmt = db()->prepare('INSERT INTO certificates (' . implode(', ', $cols) . ") VALUES ($ph)");
            $stmt->execute(array_map(fn($c) => $clean[$c], $cols));
            flash('success', "Certificate {$clean['certificate_no']} added.");
            $id = (int) db()->lastInsertId();
        }
        header('Location: ' . (($_POST['next'] ?? '') === 'generate' ? "certificate.php?id=$id" : 'dashboard.php'));
        exit;
    }
}

$gradeOptions = [];
foreach (GRADES as $g => $desc) $gradeOptions[$g] = "$g  ($desc)";

admin_header($id ? 'Edit Certificate' : 'Add Certificate', $id ? 'dashboard' : 'add');
?>
<div class="page-head">
  <div>
    <a href="dashboard.php" class="crumb">← All certificates</a>
    <h1><?= $id ? 'Edit Certificate' : 'Add Certificate' ?></h1>
    <p class="muted"><?= $id ? 'Update the details shown on the verification page.' : 'Fill in the certificate details. Fields marked * are mandatory.' ?></p>
  </div>
</div>

<?php if ($errors): ?>
  <div class="flash flash-error" role="alert">Please fix the highlighted fields below.</div>
<?php endif; ?>

<div class="cert-editor">
<form method="post" class="card form-card" id="cert-form" novalidate>
  <?= csrf_field() ?>
  <!-- Order follows the printed certificate, top to bottom -->
  <h3 class="section-title"><span class="step">1</span> Awarded To</h3>
  <div class="grid-2">
    <?php field('student_name', 'Student Name', $data, $errors, 'text', [], 'Printed in large letters at the top', 'e.g. Ananya R Rao'); ?>
    <?php field('parent_name', 'Parent / Spouse Name', $data, $errors, 'text', [], 'Printed after "Son/Daughter/Spouse of"', 'e.g. Ramesh Rao'); ?>
  </div>

  <h3 class="section-title"><span class="step">2</span> Course &amp; Grade</h3>
  <div class="grid-2">
    <?php field('course', 'Certification / Course', $data, $errors, 'text', [], 'Excel → orange · Power BI → grey · others → blue certificate', 'e.g. Tally Prime Foundation'); ?>
    <?php field('grade', 'Grade', $data, $errors, 'select', $gradeOptions); ?>
  </div>

  <h3 class="section-title"><span class="step">3</span> Centre &amp; Issue Details</h3>
  <div class="grid-2">
    <?php field('institution', 'Name of Institution / Centre', $data, $errors); ?>
    <?php field('place_of_issue', 'Place of Issue', $data, $errors); ?>
    <?php field('certificate_date', 'Date Certified', $data, $errors, 'date'); ?>
    <?php field('release_no', 'Software', $data, $errors, 'text', [], 'Printed as "Software : …" (leave blank to hide)', 'e.g. Tally Prime'); ?>
  </div>

  <h3 class="section-title"><span class="step">4</span> Certificate Number &amp; Status</h3>
  <div class="grid-2">
    <?php field('certificate_no', 'Certificate Number', $data, $errors, 'text', [], 'Letters, digits, hyphens — used for online verification & QR code', 'e.g. ME100001'); ?>
    <?php field('status', 'Status', $data, $errors, 'select', ['active' => 'Active (shows as verified)', 'revoked' => 'Revoked (shows as not valid)']); ?>
  </div>

  <div class="form-actions">
    <a href="dashboard.php" class="btn btn-ghost">Cancel</a>
    <button type="submit" class="btn btn-ghost" name="next" value="list"><?= $id ? 'Save Changes' : 'Save Certificate' ?></button>
    <button type="submit" class="btn btn-primary" name="next" value="generate">Save &amp; Generate Certificate →</button>
  </div>
</form>

<aside class="preview">
  <div class="preview-head">
    <b>Live Preview</b>
    <small>Updates as you type</small>
  </div>
  <?php cert_sheet('cert'); ?>
  <p class="preview-note">Save, then generate the PDF with or without QR code.</p>
</aside>
</div>

<?php cert_scripts(); ?>
<script>
(() => {
  const form = document.getElementById('cert-form');
  const sheet = document.getElementById('cert');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); return m ? `${m[3]}-${months[+m[2] - 1]}-${m[1]}` : v; };
  const val = (n) => (form.elements[n]?.value || '').trim();

  function draw() {
    const no = val('certificate_no').replace(/\s+/g, '').toUpperCase();
    MarkCert.render(sheet, {
      name: val('student_name'), parentName: val('parent_name'), course: val('course'), grade: val('grade'),
      software: val('release_no'), certificateNo: no, certificateDate: fmtDate(val('certificate_date')),
      institution: val('institution'), placeOfIssue: val('place_of_issue'), status: val('status'),
    }, { qrUrl: /^[A-Z0-9-]{4,30}$/.test(no) ? MarkCert.verifyUrl(no) : null });
  }
  form.addEventListener('input', draw);
  form.addEventListener('change', draw);
  draw();
})();
</script>

<?php admin_footer();
