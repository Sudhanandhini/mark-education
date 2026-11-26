<?php
/**
 * Public certificate lookup.
 *   GET /api/verify.php?certificate_no=ME100001
 * 200 { found: true, certificate: {...}, grades: [...] }
 * 404 { found: false, message }
 * 422 { found: false, message }   invalid number
 */

require_once __DIR__ . '/../lib/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, CORS_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(405, ['found' => false, 'message' => 'Method not allowed.']);
}

$no = normalize_cert_no((string) ($_GET['certificate_no'] ?? ''));

if ($no === '') {
    respond(422, ['found' => false, 'message' => 'Please enter a certificate number.']);
}
if (!valid_cert_no($no)) {
    respond(422, ['found' => false, 'message' => 'Certificate number can contain only letters, digits and hyphens (4–30 characters).']);
}

$grades = [];
foreach (GRADES as $grade => $desc) {
    $grades[] = ['grade' => $grade, 'description' => $desc];
}

try {
    $stmt = db()->prepare(
        'SELECT certificate_no, student_name, parent_name, course, grade, release_no,
                certificate_date, institution, place_of_issue, status
           FROM certificates WHERE certificate_no = ? LIMIT 1'
    );
    $stmt->execute([$no]);
    $row = $stmt->fetch();
} catch (Throwable $ex) {
    error_log('[verify] ' . $ex->getMessage());
    respond(500, ['found' => false, 'message' => 'Verification service is temporarily unavailable. Please try again later.']);
}

if (!$row) {
    respond(404, ['found' => false, 'message' => 'No certificate found with this number. Please check the number and try again.']);
}

respond(200, [
    'found'       => true,
    'certificate' => [
        'certificateNo'   => $row['certificate_no'],
        'name'            => $row['student_name'],
        'parentName'      => $row['parent_name'],
        'course'          => $row['course'],
        'grade'           => $row['grade'],
        'software'        => $row['release_no'], // "Software" line on the certificate (column kept as release_no)
        'certificateDate' => ($d = DateTime::createFromFormat('Y-m-d', $row['certificate_date'])) ? $d->format('d-M-Y') : $row['certificate_date'],
        'institution'     => $row['institution'],
        'placeOfIssue'    => $row['place_of_issue'],
        'status'          => $row['status'],
    ],
    'grades' => $grades,
]);
