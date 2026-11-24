<?php
/** Delete a certificate (POST + CSRF only). */

require_once __DIR__ . '/../lib/auth.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}
check_csrf();

$id = (int) ($_POST['id'] ?? 0);
$stmt = db()->prepare('SELECT certificate_no FROM certificates WHERE id = ?');
$stmt->execute([$id]);
$no = $stmt->fetchColumn();

if ($no === false) {
    flash('error', 'Certificate not found.');
} else {
    db()->prepare('DELETE FROM certificates WHERE id = ?')->execute([$id]);
    flash('success', "Certificate $no deleted.");
}
header('Location: dashboard.php');
exit;
