<?php
/** Certificate list: stats, search, pagination, edit/delete. */

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/_layout.php';
require_login();

$q = trim((string) ($_GET['q'] ?? ''));
$status = (string) ($_GET['status'] ?? '');
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 15;

$where = [];
$params = [];
if ($q !== '') {
    $where[] = '(certificate_no LIKE ? OR student_name LIKE ? OR course LIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like);
}
if (in_array($status, ['active', 'revoked'], true)) {
    $where[] = 'status = ?';
    $params[] = $status;
}
$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$countStmt = db()->prepare("SELECT COUNT(*) FROM certificates $whereSql");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();
$pages = max(1, (int) ceil($total / $perPage));
$page = min($page, $pages);
$offset = ($page - 1) * $perPage;

$stmt = db()->prepare("SELECT * FROM certificates $whereSql ORDER BY updated_at DESC, id DESC LIMIT $perPage OFFSET $offset");
$stmt->execute($params);
$rows = $stmt->fetchAll();

$stats = db()->query("SELECT COUNT(*) total, SUM(status='active') active, SUM(status='revoked') revoked FROM certificates")->fetch();

$qs = fn(array $over) => '?' . http_build_query(array_merge(['q' => $q, 'status' => $status, 'page' => $page], $over));

admin_header('Certificates', 'dashboard');
?>
<div class="page-head">
  <div>
    <h1>Certificates</h1>
    <p class="muted">Manage certificates shown on the public verification page.</p>
  </div>
  <a href="edit.php" class="btn btn-primary">+ Add Certificate</a>
</div>

<div class="stats">
  <div class="stat"><span>Total</span><b><?= (int) $stats['total'] ?></b></div>
  <div class="stat ok"><span>Active</span><b><?= (int) $stats['active'] ?></b></div>
  <div class="stat bad"><span>Revoked</span><b><?= (int) $stats['revoked'] ?></b></div>
</div>

<form class="toolbar" method="get">
  <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search by certificate no., name or course…">
  <select name="status">
    <option value="">All statuses</option>
    <option value="active" <?= $status === 'active' ? 'selected' : '' ?>>Active</option>
    <option value="revoked" <?= $status === 'revoked' ? 'selected' : '' ?>>Revoked</option>
  </select>
  <button class="btn btn-dark" type="submit">Search</button>
  <?php if ($q !== '' || $status !== ''): ?><a class="btn btn-ghost" href="dashboard.php">Clear</a><?php endif; ?>
</form>

<div class="card table-card">
  <?php if (!$rows): ?>
    <div class="empty">
      <b>No certificates found.</b>
      <p class="muted"><?= $q !== '' ? 'Try a different search.' : 'Add your first certificate to get started.' ?></p>
    </div>
  <?php else: ?>
  <div class="table-scroll">
  <table>
    <thead>
      <tr><th>Certificate No.</th><th>Name</th><th>Course</th><th>Grade</th><th>Date</th><th>Status</th><th class="r">Actions</th></tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><a class="mono" href="../verify-certificate?no=<?= e(urlencode($r['certificate_no'])) ?>" target="_blank" rel="noopener" title="Open on verification page"><?= e($r['certificate_no']) ?></a></td>
        <td><b><?= e($r['student_name']) ?></b><small class="muted block">s/d/o <?= e($r['parent_name']) ?></small></td>
        <td><?= e($r['course']) ?></td>
        <td><span class="grade"><?= e($r['grade']) ?></span></td>
        <td class="nowrap"><?= e(date('d M Y', strtotime($r['certificate_date']))) ?></td>
        <td><span class="badge badge-<?= e($r['status']) ?>"><?= e(ucfirst($r['status'])) ?></span></td>
        <td class="r nowrap">
          <?php if ($r['status'] === 'active'): ?><a class="btn btn-sm btn-primary" href="certificate.php?id=<?= (int) $r['id'] ?>" title="Generate PDF / QR code">Generate</a><?php endif; ?>
          <a class="btn btn-sm btn-ghost" href="edit.php?id=<?= (int) $r['id'] ?>">Edit</a>
          <form method="post" action="delete.php" class="inline" onsubmit="return confirm('Delete certificate <?= e($r['certificate_no']) ?>? This cannot be undone.')">
            <?= csrf_field() ?>
            <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
            <button class="btn btn-sm btn-danger" type="submit">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  <?php endif; ?>
</div>

<?php if ($pages > 1): ?>
<nav class="pager" aria-label="Pages">
  <span class="muted">Showing <?= $offset + 1 ?>–<?= min($offset + $perPage, $total) ?> of <?= $total ?></span>
  <div>
    <?php if ($page > 1): ?><a class="btn btn-sm btn-ghost" href="<?= e($qs(['page' => $page - 1])) ?>">← Prev</a><?php endif; ?>
    <span class="muted">Page <?= $page ?> / <?= $pages ?></span>
    <?php if ($page < $pages): ?><a class="btn btn-sm btn-ghost" href="<?= e($qs(['page' => $page + 1])) ?>">Next →</a><?php endif; ?>
  </div>
</nav>
<?php endif; ?>

<?php admin_footer();
