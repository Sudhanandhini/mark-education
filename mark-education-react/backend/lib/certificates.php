<?php
/** Certificate form validation shared by admin add/edit. */

require_once __DIR__ . '/bootstrap.php';

const CERT_FIELDS = [
    'certificate_no', 'student_name', 'parent_name', 'course', 'grade',
    'release_no', 'certificate_date', 'institution', 'place_of_issue', 'status',
];

function blank_certificate(): array
{
    return [
        'certificate_no' => '', 'student_name' => '', 'parent_name' => '', 'course' => '',
        'grade' => 'A+', 'release_no' => '', 'certificate_date' => date('Y-m-d'),
        'institution' => 'Mark Education Academy', 'place_of_issue' => 'Bengaluru', 'status' => 'active',
    ];
}

/**
 * @return array{0: array, 1: array<string,string>} [clean data, errors keyed by field]
 */
function validate_certificate(array $in, ?int $editingId = null): array
{
    $d = [];
    foreach (CERT_FIELDS as $f) {
        $d[$f] = trim((string) ($in[$f] ?? ''));
    }
    $d['certificate_no'] = normalize_cert_no($d['certificate_no']);
    $d['student_name']   = preg_replace('/\s+/', ' ', $d['student_name']);
    $d['parent_name']    = preg_replace('/\s+/', ' ', $d['parent_name']);

    $err = [];
    $nameRe = "/^[A-Za-z][A-Za-z .']{1,119}$/";

    if ($d['certificate_no'] === '') $err['certificate_no'] = 'Certificate number is required.';
    elseif (!valid_cert_no($d['certificate_no'])) $err['certificate_no'] = 'Use 4–30 letters, digits or hyphens.';

    if ($d['student_name'] === '') $err['student_name'] = 'Student name is required.';
    elseif (!preg_match($nameRe, $d['student_name'])) $err['student_name'] = 'Letters, spaces, dots and apostrophes only.';

    if ($d['parent_name'] === '') $err['parent_name'] = 'Parent / spouse name is required.';
    elseif (!preg_match($nameRe, $d['parent_name'])) $err['parent_name'] = 'Letters, spaces, dots and apostrophes only.';

    if ($d['course'] === '') $err['course'] = 'Course / certification is required.';
    elseif (mb_strlen($d['course']) > 150) $err['course'] = 'Maximum 150 characters.';

    if (!array_key_exists($d['grade'], GRADES)) $err['grade'] = 'Choose a valid grade.';

    if (mb_strlen($d['release_no']) > 40) $err['release_no'] = 'Maximum 40 characters.';

    $date = DateTime::createFromFormat('Y-m-d', $d['certificate_date']);
    if (!$date || $date->format('Y-m-d') !== $d['certificate_date']) $err['certificate_date'] = 'Enter a valid date.';
    elseif ($date > new DateTime('tomorrow')) $err['certificate_date'] = 'Date cannot be in the future.';

    if ($d['institution'] === '') $err['institution'] = 'Institution / centre name is required.';
    elseif (mb_strlen($d['institution']) > 150) $err['institution'] = 'Maximum 150 characters.';

    if ($d['place_of_issue'] === '') $err['place_of_issue'] = 'Place of issue is required.';
    elseif (mb_strlen($d['place_of_issue']) > 80) $err['place_of_issue'] = 'Maximum 80 characters.';

    if (!in_array($d['status'], ['active', 'revoked'], true)) $err['status'] = 'Choose a valid status.';

    // Unique certificate number
    if (empty($err['certificate_no'])) {
        $stmt = db()->prepare('SELECT id FROM certificates WHERE certificate_no = ? AND id <> ? LIMIT 1');
        $stmt->execute([$d['certificate_no'], $editingId ?? 0]);
        if ($stmt->fetch()) $err['certificate_no'] = 'This certificate number already exists.';
    }

    return [$d, $err];
}
