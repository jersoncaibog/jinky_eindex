# Project Requirements: RFID-Based Student Records Web App

## Overview

This project involves developing a web application that uses RFID technology to manage and display student records. The system focuses on tracking scores for quizzes, activities, and exams for the teachers use. It includes CRUD functionality for managing both student records and individual performance records across the three categories.

---

## Functional Requirements

### 1. RFID Integration

- **RFID Scanning**:
  - Ability to scan RFID tags to retrieve student information.
  - Ensure compatibility with standard RFID readers.

### 2. Student Management

- **Create**:
  - Add new students with details (e.g., name, ID, RFID tag).
- **Read**:
  - View student profiles, including their academic performance.
- **Update**:
  - Edit student details (e.g., name, ID, RFID tag).
- **Delete**:
  - Remove a student record.

### 3. Performance Records Management

- **Quizzes, Activities, Exams**:
  - Record scores for quizzes, activities, and exams.
  - Display individual and cumulative scores per category.
- **CRUD Operations**:
  - Add, update, delete, and view performance records.

### 4. Dashboard

- **Student Dashboard**:
  - Display student profile, RFID tag, and performance records.
  - Include tabs or sections for quizzes, activities, and exams.
- **Admin Dashboard**:
  - Manage students and records.
  - Display summary metrics (e.g., average scores, number of students).

### 5. Search and Filtering

- **Search Functionality**:
  - Allow searching students by name, ID, or RFID tag.
- **Filtering**:
  - Filter performance records by category, date, or score range.

---

## Non-Functional Requirements

### 1. Usability

- Intuitive user interface for administrators (no student interface, only for admins which are teachers).
- Responsive design to support desktop and mobile devices.
- Pinkish theme applied to the application for a consistent visual style.
- Only light mode supported; dark mode is not available.

---

## Tech Stack

### Frontend

- **HTML**: Markup for structuring the web app.
- **CSS**: Styling for the user interface.
- **JavaScript**: For interactivity and dynamic content.

### Backend

- **Node.js**: Runtime environment for server-side development.
- **Express.js**: Framework for building APIs and server-side logic.
- **MariaDB**: Database for storing student and performance records.

### Deployment

- No deployment needed for now.

### Other Tools

- **RFID Reader**: Hardware for scanning RFID tags.

---

## Database Schema

### Students Table

| Column    | Type     | Description          |
| --------- | -------- | -------------------- |
| id        | INT (PK) | Unique identifier    |
| name      | VARCHAR  | Student name         |
| rfid\_tag | VARCHAR  | RFID tag value       |
| course    | VARCHAR  | Student's course     |
| year      | INT      | Student's year level |
| section   | VARCHAR  | Student's section    |

### Records Table

| Column      | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| id          | INT (PK) | Unique identifier                    |
| student\_id | INT (FK) | References Students table            |
| category    | ENUM     | quizzes, exams, activities           |
| items       | ENUM     | total number of items                |
| score       | FLOAT    | Score of the record                  |
| date\_time  | DATETIME | Date and time the activity was taken |

