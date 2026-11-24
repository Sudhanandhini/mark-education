<?php
/** Log out (POST + CSRF so other sites can't log you out). */

require_once __DIR__ . '/../lib/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    logout();
}
header('Location: index.php');
exit;
