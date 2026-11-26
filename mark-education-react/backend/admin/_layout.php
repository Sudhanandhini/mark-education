<?php
/** Admin page chrome (sidebar layout). Usage: admin_header('Title', 'active-key'); ...content...; admin_footer(); */

/** Small stroke icons for the sidebar. */
function admin_icon(string $name): string
{
    $paths = [
        'list'     => '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
        'plus'     => '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>',
        'award'    => '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
        'key'      => '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
        'external' => '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
        'logout'   => '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
        'menu'     => '<path d="M4 6h16M4 12h16M4 18h16"/>',
    ];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? '') . '</svg>';
}

function admin_header(string $title, string $active = ''): void
{
    $user = $_SESSION['admin_user'] ?? '';
    $flash = take_flash();
    $nav = [
        'Certificates' => [
            ['dashboard', 'dashboard.php', 'All Certificates', 'list'],
            ['add', 'edit.php', 'Add Certificate', 'plus'],
            ['generate', 'certificate.php', 'Generate Certificate', 'award'],
        ],
        'Account' => [
            ['password', 'password.php', 'Change Password', 'key'],
            ['', '../verify-certificate', 'Verification Page', 'external'],
        ],
    ];
    ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> · Mark Education Admin</title>
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;600;700;800&family=Open+Sans:wght@400;700&family=Poppins:wght@400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/admin.css?v=3">
</head>
<body class="app">
<aside class="side" id="side" aria-label="Admin navigation">
  <a href="dashboard.php" class="side-brand" aria-label="Mark Education Academy — Certificate Admin">
    <span class="side-logo"><img src="assets/logo.webp" alt="Mark Education Academy"></span>
    <small>Certificate Admin</small>
  </a>
  <nav class="side-nav">
    <?php foreach ($nav as $group => $items): ?>
      <span class="side-group"><?= e($group) ?></span>
      <?php foreach ($items as [$key, $href, $label, $icon]):
          $ext = str_starts_with($href, '..'); ?>
        <a href="<?= e($href) ?>" class="<?= $key !== '' && $key === $active ? 'on' : '' ?>" <?= $ext ? 'target="_blank" rel="noopener"' : '' ?>>
          <?= admin_icon($icon) ?><span><?= e($label) ?></span><?= $ext ? '<i class="ext">↗</i>' : '' ?>
        </a>
      <?php endforeach; ?>
    <?php endforeach; ?>
  </nav>
  <div class="side-user">
    <span class="who-av"><?= e(strtoupper(substr($user, 0, 1))) ?></span>
    <div><b><?= e($user) ?></b><small>Administrator</small></div>
  </div>
</aside>
<div class="side-scrim" data-side-close></div>

<div class="shell">
  <header class="topbar">
    <button type="button" class="side-toggle" aria-label="Open menu" aria-controls="side" data-side-open><?= admin_icon('menu') ?></button>
    <div class="topbar-title">
      <small>Certificate Admin</small>
      <b><?= e($title) ?></b>
    </div>
    <form method="post" action="logout.php" class="logout">
      <?= csrf_field() ?>
      <span class="who"><span class="who-av"><?= e(strtoupper(substr($user, 0, 1))) ?></span><?= e($user) ?></span>
      <button type="submit" class="btn btn-ghost btn-sm"><?= admin_icon('logout') ?> Logout</button>
    </form>
  </header>
  <main class="main">
<?php if ($flash): ?>
  <div class="flash flash-<?= e($flash['type']) ?>" role="status"><?= e($flash['message']) ?></div>
<?php endif;
}

function admin_footer(): void
{
    ?>
  </main>
  <footer class="foot">
    <span>© <?= date('Y') ?> Mark Education Academy. All Rights Reserved.</span>
    <span>Developed by <a href="https://www.manithas.com/" target="_blank" rel="noopener">Manithas Technology</a></span>
  </footer>
</div>
<script>
  // mobile sidebar
  document.querySelector('[data-side-open]').addEventListener('click', () => document.body.classList.add('side-open'));
  document.querySelector('[data-side-close]').addEventListener('click', () => document.body.classList.remove('side-open'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('side-open'); });
</script>
</body>
</html>
<?php
}

/** Render a text/date/select input with its validation message. */
function field(string $name, string $label, array $data, array $errors, string $type = 'text', array $options = [], string $hint = '', string $placeholder = ''): void
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
      <input id="f-<?= e($name) ?>" type="<?= e($type) ?>" name="<?= e($name) ?>" value="<?= e($val) ?>" <?= $placeholder !== '' ? 'placeholder="' . e($placeholder) . '"' : '' ?> <?= $required ? 'required' : '' ?>>
    <?php endif; ?>
    <small class="msg"><?= e($err ?: $hint) ?></small>
  </div>
<?php
}
