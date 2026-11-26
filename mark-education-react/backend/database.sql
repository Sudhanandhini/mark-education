-- Mark Education Academy — certificate verification schema
-- Import with:  mysql -u root --default-character-set=utf8mb4 < database.sql   (or phpMyAdmin → Import)

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS mark_education
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mark_education;

-- Issued certificates
CREATE TABLE IF NOT EXISTS certificates (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  certificate_no   VARCHAR(30)  NOT NULL,
  student_name     VARCHAR(120) NOT NULL,
  parent_name      VARCHAR(120) NOT NULL,
  course           VARCHAR(150) NOT NULL,
  grade            VARCHAR(5)   NOT NULL,
  release_no       VARCHAR(40)  NOT NULL DEFAULT '',
  certificate_date DATE         NOT NULL,
  institution      VARCHAR(150) NOT NULL,
  place_of_issue   VARCHAR(80)  NOT NULL DEFAULT 'Bengaluru',
  status           ENUM('active','revoked') NOT NULL DEFAULT 'active',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_certificate_no (certificate_no),
  KEY idx_student_name (student_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users. The default admin (see config.php) is created automatically
-- on first use, with a bcrypt-hashed password — no plain-text passwords stored.
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(80)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Failed login attempts, used to lock out brute-force attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_address   VARCHAR(45) NOT NULL,
  attempted_at DATETIME NOT NULL,
  KEY idx_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample records (safe to delete from the admin panel)
INSERT IGNORE INTO certificates
  (certificate_no, student_name, parent_name, course, grade, release_no, certificate_date, institution, place_of_issue, status)
VALUES
  ('ME100001', 'Ananya R Rao',  'Ramesh Rao',   'Tally Prime Foundation',  'A+', 'Tally Prime',            '2026-01-29', 'Mark Education Academy', 'Bengaluru', 'active'),
  ('ME100002', 'Kiran S Kumar', 'Suresh Kumar', 'Advanced Excel',          'A',  'Microsoft Office Excel', '2026-03-14', 'Mark Education Academy', 'Bengaluru', 'active'),
  ('ME100003', 'Divya M Nair',  'Mohan Nair',   'Power BI Data Analytics', 'B',  'Microsoft Power BI',     '2025-11-02', 'Mark Education Academy', 'Bengaluru', 'revoked');
