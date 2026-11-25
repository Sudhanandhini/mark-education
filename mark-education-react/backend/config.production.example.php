<?php
/**
 * LIVE (cPanel) configuration.
 *
 * 1. Copy this file to  config.production.php  (same folder).
 * 2. Fill in the database details from cPanel → MySQL® Databases.
 * 3. Run  npm run build:cpanel  — the build uses this file as config.php.
 *
 * config.production.php is git-ignored so live passwords never get committed.
 */

define('DB_HOST', 'localhost');                 // cPanel MySQL is almost always "localhost"
define('DB_PORT', '3306');
define('DB_NAME', 'cpaneluser_markedu');        // full name incl. cPanel prefix
define('DB_USER', 'cpaneluser_markadmin');      // full name incl. cPanel prefix
define('DB_PASS', 'CHANGE_ME');

// Used only to create the first admin account; change the password in Admin → Change Password after first login.
define('DEFAULT_ADMIN_USER', 'markedu@admin');
define('DEFAULT_ADMIN_PASS', 'Markedu@2026');

define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_WINDOW_MIN', 15);

const GRADES = [
    'A+' => '>= 75%',
    'A'  => '>= 60% < 75%',
    'B'  => '>= 36% < 60%',
];

// Site and API are on the same domain, so no cross-origin access is needed
const CORS_ORIGINS = [];

date_default_timezone_set('Asia/Kolkata');
