/**
 * Build a single cPanel-ready folder (React site + PHP backend) in  dist/
 *
 *   npm run build:cpanel                 → site at /mark-edu/  (see package.json)
 *   node scripts/build-cpanel.mjs --base=/          → site at the domain root
 *   node scripts/build-cpanel.mjs --base=/myfolder/ → site at /myfolder/
 *
 * Output:
 *   dist/               upload the CONTENTS to the matching folder on the server
 *                       (e.g. public_html/mark-edu for --base=/mark-edu/)
 *   deploy/dist.zip     the same contents zipped (upload + "Extract" in cPanel File Manager)
 *   deploy/database.sql import once via cPanel → phpMyAdmin
 *   deploy/DEPLOY.txt   step-by-step instructions
 */
import { execSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const backend = join(root, 'backend')
const dist = join(root, 'dist')
const deploy = join(root, 'deploy')

// --base=/mark-edu/  → always with leading + trailing slash
const arg = process.argv.find((a) => a.startsWith('--base='))
let base = (arg ? arg.slice(7) : process.env.BASE_PATH || '/').trim()
base = `/${base.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/')

const step = (msg) => console.log(`\n\x1b[36m▸ ${msg}\x1b[0m`)
const warn = (msg) => console.log(`\x1b[33m  ⚠ ${msg}\x1b[0m`)

// 1. React production build for this folder
step(`Building React site for  ${base}  (vite build)…`)
execSync('npx vite build', { cwd: root, stdio: 'inherit', env: { ...process.env, BASE_PATH: base } })

// 2. Add the PHP backend into dist/
step('Adding PHP backend to dist/ …')
for (const dir of ['api', 'admin', 'lib']) {
  cpSync(join(backend, dir), join(dist, dir), { recursive: true })
}
const prodConfig = join(backend, 'config.production.php')
if (existsSync(prodConfig)) {
  cpSync(prodConfig, join(dist, 'config.php'))
  console.log('  ✓ config.php ← backend/config.production.php (live database settings)')
} else {
  cpSync(join(backend, 'config.php'), join(dist, 'config.php'))
  warn('backend/config.production.php not found — copied the LOCAL config.php.')
  warn('Edit config.php on the server with your cPanel database details.')
}

// 3. Apache rules: React routing inside the folder + protect internal files
writeFileSync(
  join(dist, '.htaccess'),
  `# Mark Education Academy — React site + PHP backend (folder: ${base})
Options -Indexes
DirectoryIndex index.html index.php

# Block direct access to internal files
<FilesMatch "^(config\\.php|.*\\.sql|.*\\.md|\\.env.*)$">
  Require all denied
</FilesMatch>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${base}

  # Force HTTPS — uncomment once your SSL certificate is active
  # RewriteCond %{HTTPS} off
  # RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Real files/folders (assets, api/*.php, admin/) are served as they are
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Never hand API/admin URLs to the React app
  RewriteRule ^(api|admin)(/|$) - [L]

  # Everything else (about, courses/excel, verify-certificate …) → React
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  <FilesMatch "index\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`,
)
// Long cache for hashed build files only (names change on every build)
writeFileSync(
  join(dist, 'assets', '.htaccess'),
  `<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`,
)

// 4. deploy/ : database script, instructions, zip
rmSync(deploy, { recursive: true, force: true })
mkdirSync(deploy, { recursive: true })

// cPanel creates the database itself → drop CREATE DATABASE / USE
const sql = readFileSync(join(backend, 'database.sql'), 'utf8')
  .replace(/^CREATE DATABASE[\s\S]*?;\s*$/m, '-- (database is created in cPanel → MySQL Databases)')
  .replace(/^USE\s+\S+;\s*$/m, '')
writeFileSync(join(deploy, 'database.sql'), sql)

const folder = base === '/' ? 'public_html' : `public_html${base.replace(/\/$/, '')}`
writeFileSync(
  join(deploy, 'DEPLOY.txt'),
  `MARK EDUCATION ACADEMY — cPanel deployment   (site folder: ${base})
=====================================================================

1) DATABASE (first time only)
   cPanel → MySQL® Databases:
     - Create a database        (e.g. cpaneluser_markedu)
     - Create a user + password (e.g. cpaneluser_markadmin)
     - Add the user to the database with ALL PRIVILEGES
   cPanel → phpMyAdmin → select the database → Import → deploy/database.sql → Go

2) UPLOAD
   cPanel → File Manager → ${folder}
     - Upload deploy/dist.zip, right-click → Extract, then delete the zip
       (or upload the contents of the dist folder)
     - Settings (top-right) → tick "Show Hidden Files" and check that .htaccess is there

3) CONFIGURE
   Edit ${folder}/config.php → set DB_NAME, DB_USER, DB_PASS from step 1
   (skip if you filled in backend/config.production.php before building)

4) PHP VERSION
   cPanel → MultiPHP Manager → PHP 8.0 or newer (with pdo_mysql)

5) TEST
   https://yourdomain${base}                     → website
   https://yourdomain${base}verify-certificate   → try ME100001
   https://yourdomain${base}admin/               → login markedu@admin / Markedu@2026
   Then: Change Password, delete the sample certificates, add real ones.

6) HTTPS
   Once SSL is active, uncomment the "Force HTTPS" lines in ${folder}/.htaccess

UPDATING THE SITE LATER
   Run  npm run build:cpanel  again and upload dist/ (or deploy/dist.zip).
   Keep the live config.php (don't overwrite it unless you use config.production.php).
`,
)

step('Creating deploy/dist.zip …')
const entries = readdirSync(dist) // includes .htaccess; avoids './' prefixes in the archive
const zip = spawnSync('tar', ['-a', '-c', '-f', join(deploy, 'dist.zip'), '-C', dist, ...entries], { stdio: 'pipe' })
if (zip.status === 0) console.log('  ✓ deploy/dist.zip')
else warn('Could not create the zip automatically — zip the contents of dist/ yourself.')

step(`Done → upload  dist/  to  ${folder}   (see deploy/DEPLOY.txt)`)
