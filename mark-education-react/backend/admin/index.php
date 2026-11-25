<?php
/** Admin login. */

require_once __DIR__ . '/../lib/auth.php';

try {
    ensure_default_admin();
} catch (Throwable $ex) {
    error_log('[admin] ' . $ex->getMessage());
    http_response_code(500);
    // Explain the likely cause (never prints the password)
    $code = $ex instanceof PDOException ? (int) ($ex->errorInfo[1] ?? 0) : 0;
    $hint = match ($code) {
        1045 => 'Access denied: DB_USER or DB_PASS in config.php is wrong, or the user is not added to the database (cPanel → MySQL Databases → Add User To Database, ALL PRIVILEGES).',
        1044 => 'The database user has no permission on this database. In cPanel → MySQL Databases, add the user to the database with ALL PRIVILEGES.',
        1049 => 'Database "' . DB_NAME . '" does not exist. Set DB_NAME in config.php to the full name shown in cPanel (including the prefix, e.g. cpaneluser_markedu).',
        1146 => 'The database is connected but the tables are missing. Import database.sql in phpMyAdmin.',
        2002, 2006 => 'Cannot reach the MySQL server. Set DB_HOST to "localhost" in config.php.',
        default => 'Check DB_HOST, DB_NAME, DB_USER and DB_PASS in config.php, and that database.sql is imported.',
    };
    exit('<h2 style="font-family:sans-serif">Database connection failed</h2><p style="font-family:sans-serif;max-width:640px">'
        . e($hint) . '</p><p style="font-family:sans-serif;color:#888">Database: ' . e(DB_NAME) . ' · User: ' . e(DB_USER) . ' · Host: ' . e(DB_HOST) . '</p>');
}

if (is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$username = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if (too_many_attempts()) {
        $error = 'Too many failed attempts. Please wait ' . LOGIN_WINDOW_MIN . ' minutes and try again.';
    } elseif ($username === '' || $password === '') {
        $error = 'Please enter your username and password.';
    } elseif (attempt_login($username, $password)) {
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Invalid username or password.';
    }
}
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Admin Login · Mark Education</title>
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/admin.css">
</head>
<body class="login-page">
  <div class="login-card">
    <aside class="login-side">
      <span class="ring"></span>
      <span class="brand-mark lg">M</span>
      <h1>Mark Education <em>Academy</em></h1>
      <p>Certificate management portal. Add, update and verify student certificates.</p>
    </aside>
    <form method="post" class="login-form" novalidate autocomplete="off">
      <?= csrf_field() ?>
      <h2>Admin Login</h2>
      <p class="muted">Sign in to manage certificates.</p>

      <?php if ($error): ?>
        <div class="flash flash-error" role="alert"><?= e($error) ?></div>
      <?php endif; ?>

      <div class="field">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" value="<?= e($username) ?>" required autofocus autocomplete="username">
      </div>
      <div class="field">
        <label for="password">Password</label>
        <div class="pw">
          <input id="password" name="password" type="password" required autocomplete="current-password">
          <button type="button" class="pw-toggle" aria-label="Show password" onclick="const i=document.getElementById('password');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'Show':'Hide'">Show</button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-block">Sign In →</button>
      <a href="../" class="back">← Back to website</a>
    </form>
  </div>
</body>
</html>
