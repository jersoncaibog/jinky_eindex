import { handleSaveStudent, loadStudents } from './students.js';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const searchInput = document.getElementById('searchInput');
    const rfidInput = document.getElementById('rfidInput');
    const searchRfidBtn = document.getElementById('searchRfidBtn');
    const saveStudentBtn = document.getElementById('saveStudentBtn');
    const searchResult = document.getElementById('searchResult');
    const viewIndexBtn = document.getElementById('viewIndexBtn');

    // Focus on RFID input
    rfidInput?.focus();

    // Event Listeners
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterStudents(searchTerm);
    });

    rfidInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleRFIDScan();
        }
    });

    searchRfidBtn?.addEventListener('click', handleRFIDScan);
    saveStudentBtn?.addEventListener('click', handleSaveStudent);
    viewIndexBtn?.addEventListener('click', () => {
        const studentId = viewIndexBtn.dataset.studentId;
        if (studentId) {
            window.location.href = `/student.html?id=${studentId}`;
        }
    });

    // Load initial data
    loadStudents();
});

function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('#studentsTable tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function handleRFIDScan() {
    const rfidInput = document.getElementById('rfidInput');
    const searchResult = document.getElementById('searchResult');
    const rfidValue = rfidInput.value.trim();
    
    if (!rfidValue) return;

    try {
        const response = await fetch(`http://localhost:3000/api/students/rfid/${rfidValue}`);
        const data = await response.json();

        if (data.success) {
            const student = data.student;
            searchResult.classList.remove('d-none');
            searchResult.querySelector('.student-info').innerHTML = `
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Year:</strong> ${student.year}</p>
                <p><strong>Section:</strong> ${student.section}</p>
            `;
            
            // Set student ID for view button
            const viewIndexBtn = document.getElementById('viewIndexBtn');
            viewIndexBtn.dataset.studentId = student.id;
            viewIndexBtn.classList.remove('d-none');
        } else {
            searchResult.classList.add('d-none');
            showToast('Student not found', 'error');
        }
    } catch (error) {
        console.error('Error scanning RFID:', error);
        showToast('Error scanning RFID', 'error');
    }

    // Clear input
    rfidInput.value = '';
    rfidInput.focus();
}