const Record = require('../models/record');

exports.getStudentRecords = async (req, res) => {
    try {
        const records = await Record.getByStudentId(req.params.studentId);
        res.json({ success: true, records });
    } catch (error) {
        console.error('Error in getStudentRecords:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getRecord = async (req, res) => {
    try {
        const record = await Record.getById(req.params.id);
        if (record) {
            res.json({ success: true, record });
        } else {
            res.status(404).json({ success: false, message: 'Record not found' });
        }
    } catch (error) {
        console.error('Error in getRecord:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createRecord = async (req, res) => {
    try {
        const { category, record_number, items, score } = req.body;
        const studentId = req.params.studentId;
        
        // Basic validation
        if (!category || !record_number || !items || score === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Type validation
        const recordNum = parseInt(record_number);
        const itemsNum = parseInt(items);
        const scoreNum = parseFloat(score);

        if (isNaN(recordNum) || recordNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Record number must be a positive integer'
            });
        }

        if (isNaN(itemsNum) || itemsNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Items must be a positive integer'
            });
        }

        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > itemsNum) {
            return res.status(400).json({
                success: false,
                message: `Score must be between 0 and ${itemsNum}`
            });
        }

        const insertId = await Record.create({
            student_id: studentId,
            category,
            record_number: recordNum,
            items: itemsNum,
            score: scoreNum
        });

        res.status(201).json({ 
            success: true, 
            message: 'Record created successfully',
            recordId: insertId
        });
    } catch (error) {
        console.error('Error in createRecord:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false, 
                message: 'Record number already exists for this category' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Server error' 
            });
        }
    }
};

exports.updateRecord = async (req, res) => {
    try {
        const { category, record_number, items, score } = req.body;
        const recordId = req.params.id;
        const studentId = req.params.studentId;

        // Basic validation
        if (!category || !record_number || !items || score === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Type validation
        const recordNum = parseInt(record_number);
        const itemsNum = parseInt(items);
        const scoreNum = parseFloat(score);

        if (isNaN(recordNum) || recordNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Record number must be a positive integer'
            });
        }

        if (isNaN(itemsNum) || itemsNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Items must be a positive integer'
            });
        }

        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > itemsNum) {
            return res.status(400).json({
                success: false,
                message: `Score must be between 0 and ${itemsNum}`
            });
        }

        const success = await Record.update(recordId, {
            student_id: studentId,
            category,
            record_number: recordNum,
            items: itemsNum,
            score: scoreNum
        });

        if (success) {
            res.json({ 
                success: true, 
                message: 'Record updated successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Record not found' 
            });
        }
    } catch (error) {
        console.error('Error in updateRecord:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false, 
                message: 'Record number already exists for this category' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const success = await Record.delete(req.params.id);
        if (success) {
            res.json({ 
                success: true, 
                message: 'Record deleted successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Record not found' 
            });
        }
    } catch (error) {
        console.error('Error in deleteRecord:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
}; 