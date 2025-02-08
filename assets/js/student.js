import { showToast } from './api.js';
import { initializeRecords } from './records.js';

// Get student ID from URL
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

if (!studentId) {
    window.location.href = '/';
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load student details
        const response = await fetch(`http://localhost:3000/api/students/${studentId}`);
        const data = await response.json();

        if (!data.success) {
            showToast('Failed to load student data', 'error');
            return;
        }

        const student = data.student;
        
        // Display student info
        document.getElementById('studentInfo').innerHTML = `
            <div class="info-container p-4 mb-4">
                <div class="row g-4">
                    <div class="col-sm-6">
                        <div class="info-item">
                            <span class="info-label">Name</span>
                            <span class="info-value">${student.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">RFID Tag</span>
                            <span class="info-value">${student.rfid_tag}</span>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="info-item">
                            <span class="info-label">Course</span>
                            <span class="info-value">${student.course}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Year & Section</span>
                            <span class="info-value">${student.year}-${student.section}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize records functionality
        initializeRecords(studentId);

    } catch (error) {
        console.error('Error loading student data:', error);
        showToast('Error loading student data', 'error');
    }
}); 