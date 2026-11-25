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

## Deploying to cPanel (one folder)

```
npm run build:cpanel
```
Builds the React site **and** adds this PHP backend into **`dist/`**, set up for the site folder
**`/mark-edu/`** (i.e. `https://yourdomain/mark-edu/` → `public_html/mark-edu`).

| Output | What to do with it |
|---|---|
| `dist/` | Upload its **contents** to `public_html/mark-edu` |
| `deploy/dist.zip` | Same contents zipped — upload in File Manager and **Extract** |
| `deploy/database.sql` | Import once in phpMyAdmin (no `CREATE DATABASE` line — cPanel creates the DB) |
| `deploy/DEPLOY.txt` | Step-by-step checklist |

A different folder? Change `--base=/mark-edu/` in the `build:cpanel` script in `package.json`
(use `--base=/` for the domain root). Everything — links, API calls, `.htaccess` — follows it.

`dist/.htaccess` is generated: React routes work on refresh, `/api` and `/admin` go to PHP,
`config.php` / `lib/` are blocked, build assets are cached.

**Live database settings:** copy `config.production.example.php` → `config.production.php`, fill in the
cPanel database name/user/password, then build — it becomes `config.php` in `dist/`.
(`config.production.php` is git-ignored.) Without it, edit `config.php` on the server.

Requirements: PHP 8.0+ with `pdo_mysql`, Apache with `mod_rewrite` (standard on cPanel).

## Security notes
- Passwords are stored as bcrypt hashes; the default admin is created on first visit to `/admin/`.
- All queries use prepared statements; all admin forms are CSRF-protected.
- 5 failed logins from one IP lock login for 15 minutes (`config.php`).
- `lib/`, `config.php` and `database.sql` are blocked from direct web access by `.htaccess` (Apache).
- Use HTTPS on the live site so the admin session cookie is sent securely.
