// ============================================
// EMPLOYEE MANAGEMENT SYSTEM
// GitHub Pages Frontend + Render Django API
// ============================================

// LIVE DJANGO API
const API_BASE = "https://employee-management-system-62xp.onrender.com/api/employees/";

// ============================================
// DOM ELEMENTS
// ============================================

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

// ============================================
// SHOW MESSAGE
// ============================================

function showMessage(text, type = "success") {
  if (!messageBox) return;

  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove("hidden");

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 4000);
}

// ============================================
// BUILD SEARCH QUERY
// ============================================

function buildQuery() {
  const params = new URLSearchParams();

  if (searchInput && searchInput.value.trim()) {
    params.set("search", searchInput.value.trim());
  }

  if (departmentFilter && departmentFilter.value) {
    params.set("department", departmentFilter.value);
  }

  if (statusFilter && statusFilter.value) {
    params.set("status", statusFilter.value);
  }

  const queryString = params.toString();
  if (queryString) {
    return `${API_BASE}?${queryString}`;
  }

  return API_BASE;
}

// ============================================
// READ - LOAD EMPLOYEES
// ============================================

async function loadEmployees() {
  try {
    const response = await fetch(buildQuery());

    if (!response.ok) {
      throw new Error("Failed to load employees");
    }

    const data = await response.json();
    console.log("Employees from API:", data);

    renderTable(data);
  } catch (error) {
    console.error("GET Error:", error);
    showMessage("Unable to connect to the server. Please try again later.", "error");
  }
}

// ============================================
// RENDER EMPLOYEE TABLE
// ============================================

function renderTable(employees) {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!employees || employees.length === 0) {
    if (emptyState) {
      emptyState.textContent = "No employees found.";
      emptyState.classList.remove("hidden");
    }
    return;
  }

  if (emptyState) {
    emptyState.classList.add("hidden");
  }

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    const statusClass = (employee.status || "").replace(/\s+/g, "");

    row.innerHTML = `
      <td>${escapeHtml(employee.employee_id)}</td>
      <td>${escapeHtml(employee.employee_name)}</td>
      <td>${escapeHtml(employee.email)}</td>
      <td>${escapeHtml(employee.phone_number)}</td>
      <td>${escapeHtml(employee.department)}</td>
      <td>${escapeHtml(employee.designation)}</td>
      <td>${escapeHtml(employee.employment_type)}</td>
      <td>${employee.joining_date || ""}</td>
      <td>₹${Number(employee.salary || 0).toLocaleString("en-IN")}</td>
      <td>
        <span class="status-badge ${escapeHtml(statusClass)}">
          ${escapeHtml(employee.status)}
        </span>
      </td>
      <td class="actions-cell">
        <button class="edit-btn" data-id="${employee.id}">Edit</button>
        <button class="delete-btn" data-id="${employee.id}" data-name="${escapeHtml(employee.employee_name)}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // EDIT BUTTONS
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openEditModal(button.dataset.id);
    });
  });

  // DELETE BUTTONS
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openDeleteModal(button.dataset.id, button.dataset.name);
    });
  });
}

// ============================================
// ESCAPE HTML
// ============================================

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

// ============================================
// GET FORM VALUE SAFELY
// ============================================

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

// ============================================
// CREATE - OPEN ADD MODAL
// ============================================

function openAddModal() {
  if (!employeeModal || !employeeForm) return;

  modalTitle.textContent = "Add Employee";
  employeeForm.reset();

  const pkField = document.getElementById("employeePk");
  if (pkField) {
    pkField.value = "";
  }

  if (formError) {
    formError.textContent = "";
    formError.classList.add("hidden");
  }

  employeeModal.classList.remove("hidden");
}

// ============================================
// UPDATE - OPEN EDIT MODAL
// ============================================

async function openEditModal(id) {
  try {
    const response = await fetch(`${API_BASE}${id}/`);

    if (!response.ok) {
      throw new Error("Employee not found");
    }

    const employee = await response.json();
    console.log("Employee details:", employee);

    modalTitle.textContent = "Edit Employee";

    const pkField = document.getElementById("employeePk");
    if (pkField) pkField.value = employee.id;

    const idField = document.getElementById("employeeId");
    if (idField) idField.value = employee.employee_id || "";

    const nameField = document.getElementById("employeeName");
    if (nameField) nameField.value = employee.employee_name || "";

    const emailField = document.getElementById("email");
    if (emailField) emailField.value = employee.email || "";

    const phoneField = document.getElementById("phoneNumber");
    if (phoneField) phoneField.value = employee.phone_number || "";

    const departmentField = document.getElementById("department");
    if (departmentField) departmentField.value = employee.department || "";

    const designationField = document.getElementById("designation");
    if (designationField) designationField.value = employee.designation || "";

    const employmentField = document.getElementById("employmentType");
    if (employmentField) employmentField.value = employee.employment_type || "";

    const joiningDateField = document.getElementById("joiningDate");
    if (joiningDateField) joiningDateField.value = employee.joining_date || "";

    const salaryField = document.getElementById("salary");
    if (salaryField) salaryField.value = employee.salary || "";

    const statusField = document.getElementById("status");
    if (statusField) statusField.value = employee.status || "";

    const addressField = document.getElementById("address");
    if (addressField) addressField.value = employee.address || "";

    if (formError) {
      formError.textContent = "";
      formError.classList.add("hidden");
    }

    employeeModal.classList.remove("hidden");
  } catch (error) {
    console.error("GET single employee error:", error);
    showMessage("Could not load employee details.", "error");
  }
}

// ============================================
// CLOSE EMPLOYEE MODAL
// ============================================

function closeEmployeeModal() {
  if (employeeModal) {
    employeeModal.classList.add("hidden");
  }
}

// ============================================
// CREATE / UPDATE EMPLOYEE
// ============================================

if (employeeForm) {
  employeeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const pk = getValue("employeePk");
    const payload = {
      employee_id: getValue("employeeId"),
      employee_name: getValue("employeeName"),
      email: getValue("email"),
      phone_number: getValue("phoneNumber"),
      department: getValue("department"),
      designation: getValue("designation"),
      employment_type: getValue("employmentType"),
      joining_date: getValue("joiningDate"),
      salary: getValue("salary"),
      status: getValue("status"),
      address: getValue("address")
    };

    console.log("Sending employee data:", payload);

    const isEdit = Boolean(pk);
    const url = isEdit ? `${API_BASE}${pk}/` : API_BASE;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        console.error("Server error:", errorData);

        let errorMessage = "Please check the entered details.";
        if (typeof errorData === "object" && errorData !== null) {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey) {
            const firstError = errorData[firstKey];
            const msg = Array.isArray(firstError) ? firstError[0] : firstError;
            errorMessage = `${firstKey}: ${msg}`;
          }
        }

        if (formError) {
          formError.textContent = errorMessage;
          formError.classList.remove("hidden");
        }
        return;
      }

      console.log("Employee saved successfully");
      closeEmployeeModal();

      showMessage(
        isEdit ? "Employee updated successfully." : "Employee added successfully.",
        "success"
      );

      await loadEmployees();
    } catch (error) {
      console.error("POST / PUT error:", error);
      if (formError) {
        formError.textContent = "Network error. Unable to connect to the server.";
        formError.classList.remove("hidden");
      }
    }
  });
}

// ============================================
// DELETE MODAL
// ============================================

function openDeleteModal(id, name) {
  pendingDeleteId = id;
  const text = document.getElementById("deleteConfirmText");

  if (text) {
    text.textContent = `Are you sure you want to delete ${name}?`;
  }

  if (deleteModal) {
    deleteModal.classList.remove("hidden");
  }
}

// ============================================
// CLOSE DELETE MODAL
// ============================================

function closeDeleteModal() {
  pendingDeleteId = null;
  if (deleteModal) {
    deleteModal.classList.add("hidden");
  }
}

// ============================================
// DELETE EMPLOYEE
// ============================================

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", async function () {
    if (!pendingDeleteId) return;

    try {
      const response = await fetch(`${API_BASE}${pendingDeleteId}/`, {
        method: "DELETE"
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Delete failed");
      }

      closeDeleteModal();
      showMessage("Employee deleted successfully.", "success");
      await loadEmployees();
    } catch (error) {
      console.error("DELETE error:", error);
      showMessage("Could not delete employee.", "error");
    }
  });
}

// ============================================
// BUTTON EVENTS
// ============================================

if (addNewBtn) {
  addNewBtn.addEventListener("click", openAddModal);
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closeEmployeeModal);
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
}

// ============================================
// SEARCH & FILTERS
// ============================================

if (searchInput) {
  searchInput.addEventListener("input", function () {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(loadEmployees, 350);
  });
}

if (departmentFilter) {
  departmentFilter.addEventListener("change", loadEmployees);
}

if (statusFilter) {
  statusFilter.addEventListener("change", loadEmployees);
}

// ============================================
// INITIAL LOAD
// ============================================

loadEmployees();