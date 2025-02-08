import { clearValidation, getFormData, resetForm, showToast } from './api.js';

let currentRecordId = null;
let currentStudentId = null;

// Initialize records functionality
export function initializeRecords(studentId) {
    currentStudentId = studentId;
    
    // Add event listeners
    const addRecordBtn = document.getElementById('addRecordBtn');
    const saveRecordBtn = document.getElementById('saveRecordBtn');
    const categoryFilter = document.getElementById('categoryFilter');

    addRecordBtn?.addEventListener('click', () => {
        resetForm('recordForm');
        currentRecordId = null;
        document.querySelector('#recordModal .modal-title').textContent = 'Add New Record';
        document.getElementById('saveRecordBtn').textContent = 'Save Record';
        const modal = new bootstrap.Modal(document.getElementById('recordModal'));
        modal.show();
    });

    saveRecordBtn?.addEventListener('click', handleSaveRecord);
    categoryFilter?.addEventListener('change', (e) => filterRecords(e.target.value));

    // Load initial records
    loadRecords();
}

// Load and display records
async function loadRecords() {
    try {
        const response = await fetch(`http://localhost:3000/api/students/${currentStudentId}/records`);
        const data = await response.json();

        if (data.success) {
            renderRecordsTable(data.records);
        } else {
            showToast('Failed to load records', 'error');
        }
    } catch (error) {
        console.error('Error loading records:', error);
        showToast('Error loading records', 'error');
    }
}

function renderRecordsTable(records) {
    const container = document.getElementById('studentRecords');
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = '<p class="text-center text-muted my-4">No records found</p>';
        return;
    }

    container.innerHTML = `
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Record #</th>
                    <th>Items</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(record => `
                    <tr data-category="${record.category}">
                        <td class="text-capitalize">${record.category}</td>
                        <td>${record.record_number}</td>
                        <td>${record.items}</td>
                        <td>${record.score}</td>
                        <td>${new Date(record.date_time).toLocaleDateString()}</td>
                        <td class="text-end">
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-edit me-2" onclick="editRecord(${record.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-soft-delete" onclick="showDeleteRecordConfirmation(${record.id}, '${record.category} #${record.record_number}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Filter records by category
function filterRecords(category) {
    const rows = document.querySelectorAll('#studentRecords tbody tr');
    rows.forEach(row => {
        if (category === 'all' || row.dataset.category === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add/Edit record
async function handleSaveRecord() {
    const formData = getFormData('recordForm');
    
    if (!validateRecordForm(formData)) return;

    console.log(formData)

    try {
        const data = {
            ...formData,
            student_id: currentStudentId,
            record_number: parseInt(formData.record_number),
            items: parseInt(formData.items),
            score: parseFloat(formData.score)
        };

        const url = `http://localhost:3000/api/students/${currentStudentId}/records${currentRecordId ? `/${currentRecordId}` : ''}`;
        const method = currentRecordId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log(response)

        const result = await response.json();

        console.log(result)

        if (result.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('recordModal'));
            modal.hide();
            await loadRecords();
            showToast(currentRecordId ? 'Record updated successfully' : 'Record added successfully');
            currentRecordId = null;
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error saving record:', error);
        showToast('Error saving record', 'error');
    }
}

function validateRecordForm(data) {
    let isValid = true;
    const form = document.getElementById('recordForm');
    clearValidation(form);

    if (!data.category) {
        setInvalid('category', 'Please select a category');
        isValid = false;
    }

    const recordNumber = parseInt(data.record_number);
    if (isNaN(recordNumber) || recordNumber < 1) {
        setInvalid('record_number', 'Please enter a valid record number');
        isValid = false;
    }

    const items = parseInt(data.items);
    if (isNaN(items) || items < 1) {
        setInvalid('items', 'Please enter a valid number of items');
        isValid = false;
    }

    const score = parseFloat(data.score);
    if (isNaN(score) || score < 0 || score > items) {
        setInvalid('score', `Score must be between 0 and ${items}`);
        isValid = false;
    }

    return isValid;
}

function setInvalid(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    field.classList.add('is-invalid');
    field.nextElementSibling.textContent = message;
}

// Edit record
export async function editRecord(id) {
    try {
        currentRecordId = id;
        
        const response = await fetch(`http://localhost:3000/api/students/${currentStudentId}/records/${id}`);
        const data = await response.json();
        
        if (!data.success) {
            showToast('Failed to load record data', 'error');
            return;
        }

        const record = data.record;
        const form = document.getElementById('recordForm');
        
        form.category.value = record.category;
        form.record_number.value = record.record_number;
        form.items.value = record.items;
        form.score.value = record.score;

        document.querySelector('#recordModal .modal-title').textContent = 'Edit Record';
        document.getElementById('saveRecordBtn').textContent = 'Update Record';

        const modal = new bootstrap.Modal(document.getElementById('recordModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading record data:', error);
        showToast('Error loading record data', 'error');
    }
}

// Delete record
export function showDeleteRecordConfirmation(id, recordName) {
    const confirmationHtml = `
        <div class="modal fade" id="deleteRecordModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete Record</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete <strong>${recordName}</strong>?</p>
                        <p class="text-danger mb-0">This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmDeleteRecord(${id})">Delete Record</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('deleteRecordModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', confirmationHtml);
    const modal = new bootstrap.Modal(document.getElementById('deleteRecordModal'));
    modal.show();
}

export async function confirmDeleteRecord(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/${currentStudentId}/records/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteRecordModal'));
            modal.hide();
            await loadRecords();
            showToast('Record deleted successfully');
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        showToast('Error deleting record', 'error');
    }
}

// Make functions globally available
window.editRecord = editRecord;
window.showDeleteRecordConfirmation = showDeleteRecordConfirmation;
window.confirmDeleteRecord = confirmDeleteRecord;
