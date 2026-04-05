-- Create the database
CREATE DATABASE IF NOT EXISTS student_portal;
USE student_portal;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    math INT NOT NULL,
    science INT NOT NULL,
    english INT NOT NULL,
    history INT NOT NULL,
    geography INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert sample data
-- The password is 'password123' (bcrypt hashed)
INSERT INTO students (username, password) 
VALUES ('student1', '$2a$10$wT0X8n9/YtqT.H8aM1.dTe1G30f/DXZ61yP8YMyk.6qj5v.y/fT32');

INSERT INTO results (student_id, math, science, english, history, geography)
VALUES (1, 85, 92, 78, 88, 90);
