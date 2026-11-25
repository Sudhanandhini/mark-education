<?php
/** Admin page chrome. Usage: admin_header('Title'); ...content...; admin_footer(); */

function admin_header(string $title, string $active = ''): void
{
    $user = $_SESSION['admin_user'] ?? '';
    $flash = take_flash();
    ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> · Mark Education Admin</title>
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/admin.css">
</head>
<body class="app">
<header class="topbar">
  <div class="wrap topbar-in">
    <a href="dashboard.php" class="brand">
      <span class="brand-mark">M</span>
      <span><b>Mark Education</b><small>Certificate Admin</small></span>
    </a>
    <nav class="nav">
      <a href="dashboard.php" class="<?= $active === 'dashboard' ? 'on' : '' ?>">Certificates</a>
      <a href="edit.php" class="<?= $active === 'add' ? 'on' : '' ?>">+ Add New</a>
      <a href="password.php" class="<?= $active === 'password' ? 'on' : '' ?>">Change Password</a>
      <a href="../verify-certificate" target="_blank" rel="noopener">View Site ↗</a>
    </nav>
    <form method="post" action="logout.php" class="logout">
      <?= csrf_field() ?>
      <span class="who"><?= e($user) ?></span>
      <button type="submit" class="btn btn-ghost">Logout</button>
    </form>
  </div>
</header>
<main class="wrap main">
<?php if ($flash): ?>
  <div class="flash flash-<?= e($flash['type']) ?>" role="status"><?= e($flash['message']) ?></div>
<?php endif;
}

function admin_footer(): void
{
    ?>
</main>
<footer class="wrap foot">© <?= date('Y') ?> Mark Education Academy · Admin Panel</footer>
</body>
</html>
<?php
}

/** Render a text/date/select input with its validation message. */
function field(string $name, string $label, array $data, array $errors, string $type = 'text', array $options = [], string $hint = ''): void
{
    $err = $errors[$name] ?? '';
    $val = $data[$name] ?? '';
    $required = $name !== 'release_no';
    ?>
  <div class="field <?= $err ? 'has-error' : '' ?>">
    <label for="f-<?= e($name) ?>"><?= e($label) ?><?= $required ? ' <span class="req">*</span>' : ' <span class="opt">(optional)</span>' ?></label>
    <?php if ($type === 'select'): ?>
      <select id="f-<?= e($name) ?>" name="<?= e($name) ?>" required>
        <?php foreach ($options as $value => $text): ?>
          <option value="<?= e($value) ?>" <?= (string) $value === (string) $val ? 'selected' : '' ?>><?= e($text) ?></option>
        <?php endforeach; ?>
      </select>
    <?php else: ?>
      <input id="f-<?= e($name) ?>" type="<?= e($type) ?>" name="<?= e($name) ?>" value="<?= e($val) ?>" <?= $required ? 'required' : '' ?>>
    <?php endif; ?>
    <small class="msg"><?= e($err ?: $hint) ?></small>
  </div>
<?php
}
