# Certificate Verification — PHP + MySQL backend

Public page: `/verify-certificate` (React) → calls `api/verify.php`.
Admin panel: `/admin/` (PHP) — add, edit, revoke and delete certificates.

## Local development (XAMPP)

1. Start **MySQL** in the XAMPP control panel.
2. Import the database (once):
   ```
   C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 < backend\database.sql
   ```
   (or phpMyAdmin → Import → `database.sql`)
3. In `mark-education-react`, run two terminals:
   ```
   npm run api     # PHP backend on http://127.0.0.1:8000
   npm run dev     # website on http://localhost:5173 (proxies /api and /admin to PHP)
   ```
4. Open:
   - Verify page: http://localhost:5173/verify-certificate  (try `ME100001`)
   - Admin: http://localhost:5173/admin/

Default admin login: **markedu@admin** / **Markedu@2026** — change it from *Change Password* after the first login.

## Deploying to a PHP host (cPanel / Apache)

1. `npm run build` → upload the contents of `dist/` to the web root (e.g. `public_html/`).
2. Upload the `backend/` folder's **contents** to the same web root, so you get
   `public_html/api/`, `public_html/admin/`, `public_html/lib/`, `public_html/config.php`.
3. Create a MySQL database + user in cPanel, import `database.sql`
   (remove the `CREATE DATABASE` / `USE` lines if your host names the DB for you).
4. Edit `config.php` with the live DB name, user and password (or set the `MARK_DB_*` environment variables).
5. Add an `.htaccess` in the web root so React routes work on refresh:
   ```
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```
6. Log in to `/admin/`, change the password, delete the sample certificates and add real ones.

## Security notes
- Passwords are stored as bcrypt hashes; the default admin is created on first visit to `/admin/`.
- All queries use prepared statements; all admin forms are CSRF-protected.
- 5 failed logins from one IP lock login for 15 minutes (`config.php`).
- `lib/`, `config.php` and `database.sql` are blocked from direct web access by `.htaccess` (Apache).
- Use HTTPS on the live site so the admin session cookie is sent securely.
