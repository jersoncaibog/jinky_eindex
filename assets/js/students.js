import {
    clearValidation,
    createStudent,
    deleteStudent,
    getAllStudents,
    getFormData,
    resetForm,
    showToast,
    updateStudent
} from './api.js';

let currentStudentId = null;
let allStudents = []; // Store all students for filtering

// Load and display students
export async function loadStudents() {
    try {
        const response = await getAllStudents();
        if (response.success) {
            allStudents = response.students; // Store all students
            renderStudentsTable(allStudents);
            updateFilterOptions(); // Update filter dropdowns
        } else {
            showToast('Failed to load students', 'error');
        }
    } catch (error) {
        showToast('Error loading students', 'error');
    }
}

function updateFilterOptions() {
    // Get unique courses and sections
    const courses = [...new Set(allStudents.map(student => student.course))].sort();
    const sections = [...new Set(allStudents.map(student => student.section))].sort();

    // Update course filter
    const courseFilter = document.getElementById('courseFilter');
    courseFilter.innerHTML = '<option value="">All Courses</option>' +
        courses.map(course => `<option value="${course}">${course}</option>`).join('');

    // Update section filter
    const sectionFilter = document.getElementById('sectionFilter');
    sectionFilter.innerHTML = '<option value="">All Sections</option>' +
        sections.map(section => `<option value="${section}">${section}</option>`).join('');
}

function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const sectionFilter = document.getElementById('sectionFilter').value;

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = Object.values(student).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        );
        const matchesCourse = !courseFilter || student.course === courseFilter;
        const matchesYear = !yearFilter || student.year === parseInt(yearFilter);
        const matchesSection = !sectionFilter || student.section === sectionFilter;

        return matchesSearch && matchesCourse && matchesYear && matchesSection;
    });

    renderStudentsTable(filteredStudents);
}

function renderStudentsTable(students) {
    const tbody = document.querySelector('#studentsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td class="text-end">
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit me-2" onclick="editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-soft-delete" onclick="showDeleteConfirmation(${student.id}, '${student.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Show message if no results
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No students found
                </td>
            </tr>
        `;
    }
}

// Add/Edit student
export async function handleSaveStudent() {
    const formData = getFormData('addStudentForm');

    // Validate form
    if (!validateStudentForm(formData)) return;

    try {
        const data = {
            ...formData,
            year: parseInt(formData.year)
        };

        let response;
        if (currentStudentId) {
            response = await updateStudent(currentStudentId, data);
        } else {
            response = await createStudent(data);
        }

        if (response.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
            modal.hide();
            resetForm('addStudentForm');
            await loadStudents();
            showToast(currentStudentId ? 'Student updated successfully' : 'Student added successfully');
            currentStudentId = null;
        } else {
            showToast(response.message, 'error');
        }
    } catch (error) {
        showToast('Error saving student', 'error');
    }
}

function validateStudentForm(data) {
    let isValid = true;
    const form = document.getElementById('addStudentForm');
    clearValidation(form);

    if (!data.name?.trim()) {
        setInvalid('name', 'Name is required');
        isValid = false;
    }

    if (!data.rfid_tag?.trim()) {
        setInvalid('rfid_tag', 'RFID tag is required');
        isValid = false;
    }

    if (!data.course?.trim()) {
        setInvalid('course', 'Course is required');
        isValid = false;
    }

    const year = parseInt(data.year);
    if (isNaN(year) || year < 1 || year > 5) {
        setInvalid('year', 'Year must be between 1 and 5');
        isValid = false;
    }

    if (!data.section?.trim()) {
        setInvalid('section', 'Section is required');
        isValid = false;
    }

    return isValid;
}

function setInvalid(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    field.classList.add('is-invalid');
    field.nextElementSibling.textContent = message;
}

// Edit student
export async function editStudent(id) {
    try {
        currentStudentId = id;
        
        // Fetch complete student data from API
        const response = await fetch(`http://localhost:3000/api/students/${id}`);
        const data = await response.json();
        
        if (!data.success) {
            showToast('Failed to load student data', 'error');
            return;
        }

        const student = data.student;
        const form = document.getElementById('addStudentForm');
        
        // Fill form with complete student data
        form.name.value = student.name;
        form.rfid_tag.value = student.rfid_tag;
        form.course.value = student.course;
        form.year.value = student.year;
        form.section.value = student.section;

        // Update modal title and button
        document.querySelector('#addStudentModal .modal-title').textContent = 'Edit Student';
        document.getElementById('saveStudentBtn').textContent = 'Update Student';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading student data:', error);
        showToast('Error loading student data', 'error');
    }
}

// Delete student
export function showDeleteConfirmation(id, name) {
    const confirmationHtml = `
        <div class="modal fade" id="deleteConfirmationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete Student</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete <strong>${name}</strong>?</p>
                        <p class="text-danger mb-0">This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmDelete(${id})">Delete Student</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('deleteConfirmationModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to the document
    document.body.insertAdjacentHTML('beforeend', confirmationHtml);

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    modal.show();
}

export async function confirmDelete(id) {
    try {
        const response = await deleteStudent(id);
        if (response.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
            modal.hide();
            await loadStudents();
            showToast('Student deleted successfully');
        } else {
            showToast(response.message, 'error');
        }
    } catch (error) {
        showToast('Error deleting student', 'error');
    }
}

// Reset form when modal is closed
document.addEventListener('DOMContentLoaded', () => {
    const addStudentModal = document.getElementById('addStudentModal');
    addStudentModal?.addEventListener('hidden.bs.modal', () => {
        resetForm('addStudentForm');
        currentStudentId = null;
        document.querySelector('#addStudentModal .modal-title').textContent = 'Add New Student';
        document.getElementById('saveStudentBtn').textContent = 'Save Student';
    });

    // Add filter event listeners
    document.getElementById('searchInput')?.addEventListener('input', filterStudents);
    document.getElementById('courseFilter')?.addEventListener('change', filterStudents);
    document.getElementById('yearFilter')?.addEventListener('change', filterStudents);
    document.getElementById('sectionFilter')?.addEventListener('change', filterStudents);
});

// Make functions globally available
window.editStudent = editStudent;
window.showDeleteConfirmation = showDeleteConfirmation;
window.confirmDelete = confirmDelete;
