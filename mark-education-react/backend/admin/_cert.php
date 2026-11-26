<?php
/**
 * Certificate helpers shared by edit.php (live preview) and certificate.php (generate PDF).
 * The markup mirrors src/components/CertificateDoc.jsx; assets/certificate.js fills it in.
 */

/** DB row → the data object used by assets/certificate.js */
function cert_js_data(array $r): array
{
    $d = DateTime::createFromFormat('Y-m-d', (string) $r['certificate_date']);
    return [
        'name'            => $r['student_name'],
        'parentName'      => $r['parent_name'],
        'course'          => $r['course'],
        'grade'           => $r['grade'],
        'software'        => $r['release_no'],
        'certificateNo'   => $r['certificate_no'],
        'certificateDate' => $d ? $d->format('d-M-Y') : $r['certificate_date'],
        'institution'     => $r['institution'],
        'placeOfIssue'    => $r['place_of_issue'],
        'status'          => $r['status'],
    ];
}

/** Scripts needed for preview / PDF / QR. */
function cert_scripts(bool $pdf = false): void
{
    ?>
<script src="assets/vendor/qrcode.js"></script>
<?php if ($pdf): ?><script src="assets/vendor/jspdf.umd.min.js"></script><?php endif; ?>
<script src="assets/certificate.js?v=2"></script>
<?php
}

/** The certificate sheet. */
function cert_sheet(string $id = 'cert'): void
{
    ?>
  <div class="cert t-blue" id="<?= e($id) ?>" aria-label="Certificate preview">
    <svg viewBox="0 0 1414 2000" class="cert-bg" aria-hidden="true">
      <defs><clipPath id="<?= e($id) ?>-clip"><rect x="46" y="62" width="1322" height="1876" rx="40"/></clipPath></defs>
      <rect width="1414" height="2000" class="c-frame"/>
      <rect x="46" y="62" width="1322" height="1876" rx="40" fill="#fff"/>
      <g clip-path="url(#<?= e($id) ?>-clip)" fill="none" class="c-swoosh" stroke-width="17">
        <path d="M30 1960 C 200 1790 420 1752 612 1780"/><circle cx="707" cy="1813" r="100"/>
      </g>
    </svg>
    <img src="assets/cert-logo.png" alt="" class="c-logo">
    <h4 class="c c-title">Certificate of Merit</h4>
    <p class="c c-small" style="top:24.15%">This Certificate is awarded to</p>
    <p class="c c-name" data-p="name" data-size="72" data-max="24" data-empty="STUDENT NAME"></p>
    <p class="c c-small" style="top:33.4%">Son/Daughter/Spouse of</p>
    <p class="c c-parent" data-p="parentName" data-size="44" data-max="34" data-empty="PARENT NAME"></p>
    <p class="c c-small" style="top:43.75%">For Successfully Completing</p>
    <p class="c c-course" data-p="course" data-size="64" data-max="28" data-empty="Course Name"></p>
    <p class="c c-small" style="top:55.25%">and Securing&nbsp; <span data-p="grade"></span></p>

    <div class="c-centre"><b>Centre:</b>&nbsp;&nbsp; <span data-p="institution" data-empty="—"></span></div>
    <div class="c-issue">
      <div>Place of Issue:&nbsp; <span data-p="placeOfIssue" data-empty="—"></span></div>
      <div>Date Certified:&nbsp; <span data-p="certificateDate"></span></div>
      <div class="c-soft">Software : <span data-p="software"></span></div>
    </div>
    <div class="c-no"><b>Certificate Number:</b>&nbsp;&nbsp; <span data-p="certificateNo" data-empty="ME000000"></span></div>
    <div class="c-qr"><span class="c-qr-ph">QR code<br>added on<br>generate</span></div>
    <div class="c-verify"><b>VERIFY ME</b><span>markeducationacademy.com</span></div>
    <img src="assets/cert-signature.png" alt="" class="c-sign">
    <div class="c-signer"><div>Manjunath</div><div>Centre Head</div><div>Mark Education Academy</div><div>Bengaluru</div></div>
    <span class="c-revoked">Revoked</span>
  </div>
<?php
}
