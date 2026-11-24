<?php
/** Change the logged-in admin's password. */

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/_layout.php';
require_login();

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $current = (string) ($_POST['current'] ?? '');
    $new     = (string) ($_POST['new'] ?? '');
    $confirm = (string) ($_POST['confirm'] ?? '');

    $stmt = db()->prepare('SELECT password_hash FROM admins WHERE id = ?');
    $stmt->execute([$_SESSION['admin_id']]);
    $hash = (string) $stmt->fetchColumn();

    if (!password_verify($current, $hash)) $errors['current'] = 'Current password is incorrect.';
    if (strlen($new) < 8) $errors['new'] = 'Use at least 8 characters.';
    elseif (!preg_match('/[A-Za-z]/', $new) || !preg_match('/\d/', $new)) $errors['new'] = 'Include at least one letter and one number.';
    elseif ($new === $current) $errors['new'] = 'New password must be different from the current one.';
    if ($confirm !== $new) $errors['confirm'] = 'Passwords do not match.';

    if (!$errors) {
        db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($new, PASSWORD_DEFAULT), $_SESSION['admin_id']]);
        session_regenerate_id(true);
        flash('success', 'Password changed successfully.');
        header('Location: dashboard.php');
        exit;
    }
}

admin_header('Change Password', 'password');
?>
<div class="page-head">
  <div>
    <a href="dashboard.php" class="crumb">← All certificates</a>
    <h1>Change Password</h1>
    <p class="muted">Signed in as <b><?= e($_SESSION['admin_user']) ?></b>.</p>
  </div>
</div>

<form method="post" class="card form-card narrow" novalidate>
  <?= csrf_field() ?>
  <?php foreach (['current' => 'Current Password', 'new' => 'New Password', 'confirm' => 'Confirm New Password'] as $name => $label): ?>
    <div class="field <?= isset($errors[$name]) ? 'has-error' : '' ?>">
      <label for="f-<?= $name ?>"><?= $label ?> <span class="req">*</span></label>
      <input id="f-<?= $name ?>" type="password" name="<?= $name ?>" required autocomplete="<?= $name === 'current' ? 'current-password' : 'new-password' ?>">
      <small class="msg"><?= e($errors[$name] ?? ($name === 'new' ? 'At least 8 characters, with a letter and a number.' : '')) ?></small>
    </div>
  <?php endforeach; ?>
  <div class="form-actions">
    <a href="dashboard.php" class="btn btn-ghost">Cancel</a>
    <button type="submit" class="btn btn-primary">Update Password</button>
  </div>
</form>

<?php admin_footer();
