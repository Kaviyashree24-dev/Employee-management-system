// Base URL of the Django REST API
const API_BASE = "http://127.0.0.1:8000/api/employees/";

// --- DOM references ---
const tableBody = document.getElementById("employeeTableBody");
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("messageBox");

const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const addNewBtn = document.getElementById("addNewBtn");

const employeeModal = document.getElementById("employeeModal");
const modalTitle = document.getElementById("modalTitle");
const employeeForm = document.getElementById("employeeForm");
const formError = document.getElementById("formError");
const cancelBtn = document.getElementById("cancelBtn");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let pendingDeleteId = null;
let searchDebounce = null;

// --- Helpers ---
function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove("hidden");
  setTimeout(() => messageBox.classList.add("hidden"), 3000);
}

function buildQuery() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (departmentFilter.value) params.set("department", departmentFilter.value);
  if (statusFilter.value) params.set("status", statusFilter.value);
  const qs = params.toString();
  return qs ? `${API_BASE}?${qs}` : API_BASE;
}

// --- READ: fetch and render employees ---
async function loadEmployees() {
  try {
    const res = await fetch(buildQuery());
    if (!res.ok) throw new Error("Failed to load employees");
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    showMessage("Could not reach the server. Is the Django backend running?", "error");
    console.error(err);
  }
}

function renderTable(employees) {
  tableBody.innerHTML = "";

  if (!employees || employees.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  employees.forEach((emp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(emp.full_name)}</td>
      <td>${escapeHtml(emp.email)}</td>
      <td>${escapeHtml(emp.phone_number)}</td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${escapeHtml(emp.designation)}</td>
      <td>${emp.date_of_joining}</td>
      <td>₹${Number(emp.salary).toLocaleString("en-IN")}</td>
      <td><span class="status-badge ${emp.status}">${emp.status}</span></td>
      <td class="actions-cell">
        <button class="edit-btn" data-id="${emp.id}">Edit</button>
        <button class="delete-btn" data-id="${emp.id}" data-name="${escapeHtml(emp.full_name)}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => openEditModal(btn.dataset.id))
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => openDeleteModal(btn.dataset.id, btn.dataset.name))
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// --- CREATE / UPDATE modal handling ---
function openAddModal() {
  modalTitle.textContent = "Add Employee";
  employeeForm.reset();
  document.getElementById("employeeId").value = "";
  formError.classList.add("hidden");
  employeeModal.classList.remove("hidden");
}

async function openEditModal(id) {
  try {
    const res = await fetch(`${API_BASE}${id}/`);
    if (!res.ok) throw new Error("Employee not found");
    const emp = await res.json();

    modalTitle.textContent = "Edit Employee";
    document.getElementById("employeeId").value = emp.id;
    document.getElementById("fullName").value = emp.full_name;
    document.getElementById("email").value = emp.email;
    document.getElementById("phoneNumber").value = emp.phone_number;
    document.getElementById("department").value = emp.department;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("dateOfJoining").value = emp.date_of_joining;
    document.getElementById("salary").value = emp.salary;
    document.getElementById("status").value = emp.status;

    formError.classList.add("hidden");
    employeeModal.classList.remove("hidden");
  } catch (err) {
    showMessage("Could not load employee details.", "error");
    console.error(err);
  }
}

function closeEmployeeModal() {
  employeeModal.classList.add("hidden");
}

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("employeeId").value;
  const payload = {
    full_name: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone_number: document.getElementById("phoneNumber").value.trim(),
    department: document.getElementById("department").value,
    designation: document.getElementById("designation").value.trim(),
    date_of_joining: document.getElementById("dateOfJoining").value,
    salary: document.getElementById("salary").value,
    status: document.getElementById("status").value,
  };

  const isEdit = Boolean(id);
  const url = isEdit ? `${API_BASE}${id}/` : API_BASE;
  const method = isEdit ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      const firstError = Object.values(errData)[0];
      formError.textContent = Array.isArray(firstError) ? firstError[0] : String(firstError);
      formError.classList.remove("hidden");
      return;
    }

    closeEmployeeModal();
    showMessage(isEdit ? "Employee updated successfully." : "Employee added successfully.");
    loadEmployees();
  } catch (err) {
    formError.textContent = "Network error. Please check the server and try again.";
    formError.classList.remove("hidden");
    console.error(err);
  }
});

// --- DELETE modal handling ---
function openDeleteModal(id, name) {
  pendingDeleteId = id;
  document.getElementById("deleteConfirmText").textContent =
    `Are you sure you want to delete ${name}?`;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.classList.add("hidden");
}

confirmDeleteBtn.addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  try {
    const res = await fetch(`${API_BASE}${pendingDeleteId}/`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error("Delete failed");
    closeDeleteModal();
    showMessage("Employee deleted successfully.");
    loadEmployees();
  } catch (err) {
    showMessage("Could not delete employee. Please try again.", "error");
    console.error(err);
  }
});

// --- Event wiring ---
addNewBtn.addEventListener("click", openAddModal);
cancelBtn.addEventListener("click", closeEmployeeModal);
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(loadEmployees, 350);
});
departmentFilter.addEventListener("change", loadEmployees);
statusFilter.addEventListener("change", loadEmployees);

// --- Initial load ---
loadEmployees();
