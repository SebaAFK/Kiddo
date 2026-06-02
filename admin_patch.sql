-- Run this in MySQL Workbench to add admin table and teacher password column

USE kiddo1;

-- Add password column to teacher if not exists
ALTER TABLE teacher ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'password';

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    admin_id   VARCHAR(20)  PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    email      VARCHAR(100),
    password   VARCHAR(255) NOT NULL
);

-- Insert 2 admin users
INSERT IGNORE INTO admin (admin_id, admin_name, email, password) VALUES
('ADM001', 'Seba Al-Otaibi',  'seba@kiddo.sa',  'admin123'),
('ADM002', 'Admin Assistant', 'admin2@kiddo.sa', 'admin456');

-- Group chat table (shared between teachers and students per grade)
CREATE TABLE IF NOT EXISTS group_message (
    message_id   INT AUTO_INCREMENT PRIMARY KEY,
    grade        INT         NOT NULL,
    sender_name  VARCHAR(100) NOT NULL,
    sender_type  VARCHAR(20)  NOT NULL,  -- 'teacher', 'student', 'admin'
    content      TEXT         NOT NULL,
    sent_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
