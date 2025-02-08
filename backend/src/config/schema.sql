-- Create the database
CREATE DATABASE IF NOT EXISTS jinky_eindex;
USE jinky_eindex;
-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rfid_tag VARCHAR(50) NOT NULL UNIQUE,
    course VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Create records table
CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    category ENUM('quizzes', 'exams', 'activities') NOT NULL,
    record_number INT NOT NULL,
    items INT NOT NULL,
    score FLOAT NOT NULL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY category_number (student_id, category, record_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;