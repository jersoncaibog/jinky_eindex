const Student = require('../models/student');

exports.findByRFID = async (req, res) => {
    try {
        const student = await Student.findByRFID(req.params.rfidTag);
        if (student) {
            res.json({ success: true, student });
        } else {
            res.status(404).json({ success: false, message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error in findByRFID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.getAll();
        res.json({ success: true, students });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.getById(req.params.id);
        if (student) {
            res.json({ success: true, student });
        } else {
            res.status(404).json({ success: false, message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error in getStudentById:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getStudentRecords = async (req, res) => {
    try {
        const records = await Student.getRecords(req.params.id);
        res.json({ success: true, records });
    } catch (error) {
        console.error('Error in getStudentRecords:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, rfid_tag, course, year, section } = req.body;
        
        // Basic validation
        if (!name || !rfid_tag || !course || !year || !section) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Type validation
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 1 || yearNum > 5) {
            return res.status(400).json({
                success: false,
                message: 'Year must be a number between 1 and 5'
            });
        }

        // Create student with validated data
        const insertId = await Student.create({
            name: name.trim(),
            rfid_tag: rfid_tag.trim(),
            course: course.trim(),
            year: yearNum,
            section: section.trim()
        });

        res.status(201).json({ 
            success: true, 
            message: 'Student created successfully',
            studentId: Number(insertId) // Convert BigInt to Number
        });
    } catch (error) {
        console.error('Error in createStudent:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false, 
                message: 'RFID tag already exists' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Server error' 
            });
        }
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { name, rfid_tag, course, year, section } = req.body;
        const studentId = req.params.id;

        // Basic validation
        if (!name || !rfid_tag || !course || !year || !section) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const success = await Student.update(studentId, {
            name,
            rfid_tag,
            course,
            year,
            section
        });

        if (success) {
            res.json({ 
                success: true, 
                message: 'Student updated successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
    } catch (error) {
        console.error('Error in updateStudent:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false, 
                message: 'RFID tag already exists' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const success = await Student.delete(req.params.id);
        if (success) {
            res.json({ 
                success: true, 
                message: 'Student deleted successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
}; 