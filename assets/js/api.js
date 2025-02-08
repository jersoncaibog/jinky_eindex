const API_URL = 'http://localhost:3000/api';

// API calls
export async function getAllStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        return await response.json();
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export async function getStudentById(id) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student');
        return await response.json();
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
}

export async function createStudent(data) {
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
}

export async function updateStudent(id, data) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

export async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

// Toast notifications
export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Form utilities
export function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

export function resetForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    clearValidation(form);
}

export function clearValidation(form) {
    form.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
}

export function setFieldValidation(formId, fieldName, isValid, errorMessage = '') {
    const field = document.getElementById(formId).elements[fieldName];
    if (field) {
        field.classList.toggle('is-invalid', !isValid);
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }
    }
}
