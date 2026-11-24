<?php
/** Shared setup for API + admin: config, database connection, helpers. */

require_once __DIR__ . '/../config.php';

error_reporting(E_ALL);
ini_set('display_errors', '0'); // never leak errors to visitors
ini_set('log_errors', '1');

/** Single PDO connection (exceptions on error, real prepared statements). */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

/** HTML-escape for output. */
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Normalise a certificate number: trim, uppercase, strip inner spaces. */
function normalize_cert_no(string $no): string
{
    return strtoupper(preg_replace('/\s+/', '', trim($no)));
}

function valid_cert_no(string $no): bool
{
    return (bool) preg_match('/^[A-Z0-9-]{4,30}$/', $no);
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 45);
}

/** Format a Y-m-d date as "January 29, 2026". */
function pretty_date(?string $ymd): string
{
    if (!$ymd) return '';
    $d = DateTime::createFromFormat('Y-m-d', $ymd);
    return $d ? $d->format('F j, Y') : $ymd;
}
