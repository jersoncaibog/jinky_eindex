const pool = require('../config/database');

class Student {
    static async findByRFID(rfidTag) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM students WHERE rfid_tag = ?',
                [rfidTag]
            );
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async getAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM students ORDER BY id DESC');
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async getById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM students WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async create(studentData) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO students (name, rfid_tag, course, year, section) VALUES (?, ?, ?, ?, ?)',
                [studentData.name, studentData.rfid_tag, studentData.course, studentData.year, studentData.section]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async update(id, studentData) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'UPDATE students SET name = ?, rfid_tag = ?, course = ?, year = ?, section = ? WHERE id = ?',
                [studentData.name, studentData.rfid_tag, studentData.course, studentData.year, studentData.section, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async delete(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'DELETE FROM students WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async getRecords(studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM records WHERE student_id = ? ORDER BY date_time DESC',
                [studentId]
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Student; 