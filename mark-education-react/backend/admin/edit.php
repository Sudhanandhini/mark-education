<?php
/** Add (no id) or edit (?id=) a certificate. */

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/certificates.php';
require_once __DIR__ . '/_layout.php';
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
        }
        header('Location: dashboard.php');
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

<form method="post" class="card form-card" novalidate>
  <?= csrf_field() ?>
  <h3 class="section-title">Certificate</h3>
  <div class="grid-2">
    <?php field('certificate_no', 'Certificate Number', $data, $errors, 'text', [], 'e.g. ME100001 — letters, digits, hyphens'); ?>
    <?php field('status', 'Status', $data, $errors, 'select', ['active' => 'Active (shows as verified)', 'revoked' => 'Revoked (shows as not valid)']); ?>
    <?php field('course', 'Certification / Course', $data, $errors, 'text', [], 'e.g. Tally Prime – Advanced'); ?>
    <?php field('grade', 'Grade', $data, $errors, 'select', $gradeOptions); ?>
    <?php field('certificate_date', 'Certificate Date', $data, $errors, 'date'); ?>
    <?php field('release_no', 'Release No.', $data, $errors, 'text', [], 'e.g. Prime 6.0'); ?>
  </div>

  <h3 class="section-title">Student</h3>
  <div class="grid-2">
    <?php field('student_name', 'Student Name', $data, $errors); ?>
    <?php field('parent_name', 'Parent / Spouse Name', $data, $errors); ?>
  </div>

  <h3 class="section-title">Issued By</h3>
  <div class="grid-2">
    <?php field('institution', 'Name of Institution / Centre', $data, $errors); ?>
    <?php field('place_of_issue', 'Place of Issue', $data, $errors); ?>
  </div>

  <div class="form-actions">
    <a href="dashboard.php" class="btn btn-ghost">Cancel</a>
    <button type="submit" class="btn btn-primary"><?= $id ? 'Save Changes' : 'Add Certificate' ?></button>
  </div>
</form>

<?php admin_footer();
