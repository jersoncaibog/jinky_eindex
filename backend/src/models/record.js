const pool = require('../config/database');

class Record {
    static async getByStudentId(studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM records WHERE student_id = ? ORDER BY date_time DESC',
                [studentId]
            );
            // Convert BigInt to Number
            return rows.map(row => ({
                ...row,
                id: Number(row.id),
                student_id: Number(row.student_id)
            }));
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
                'SELECT * FROM records WHERE id = ?',
                [id]
            );
            const record = rows[0];
            if (record) {
                // Convert BigInt to Number
                record.id = Number(record.id);
                record.student_id = Number(record.student_id);
            }
            return record;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async create(recordData) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO records (student_id, category, record_number, items, score, date_time) VALUES (?, ?, ?, ?, ?, NOW())',
                [recordData.student_id, recordData.category, recordData.record_number, recordData.items, recordData.score]
            );
            // Convert BigInt to Number
            return Number(result.insertId);
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async update(id, recordData) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'UPDATE records SET student_id = ?, category = ?, record_number = ?, items = ?, score = ?, date_time = NOW() WHERE id = ?',
                [recordData.student_id, recordData.category, recordData.record_number, recordData.items, recordData.score, id]
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
                'DELETE FROM records WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Record; 