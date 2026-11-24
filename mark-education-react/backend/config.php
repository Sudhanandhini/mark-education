<?php
/**
 * Backend configuration.
 * Values can be overridden with environment variables on the server.
 * On a live server: change DB credentials, and change the admin password
 * from Admin → Change Password after the first login.
 */

define('DB_HOST', getenv('MARK_DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('MARK_DB_PORT') ?: '3306');
define('DB_NAME', getenv('MARK_DB_NAME') ?: 'mark_education');
define('DB_USER', getenv('MARK_DB_USER') ?: 'root');
define('DB_PASS', getenv('MARK_DB_PASS') ?: '');

// Default admin account — created (password hashed) the first time the admin panel is used.
define('DEFAULT_ADMIN_USER', 'markedu@admin');
define('DEFAULT_ADMIN_PASS', 'Markedu@2026');

// Login lockout: max failed attempts per IP within the window (minutes)
define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_WINDOW_MIN', 15);

// Allowed grades and their descriptions (shown on the verification page)
const GRADES = [
    'A+' => '>= 75%',
    'A'  => '>= 60% < 75%',
    'B'  => '>= 36% < 60%',
];

// Origins allowed to call the API from another domain (leave empty when site + API share a domain)
const CORS_ORIGINS = [];

date_default_timezone_set('Asia/Kolkata');
