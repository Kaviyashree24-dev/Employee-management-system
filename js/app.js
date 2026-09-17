// ==========================================
// Employee Management System
// JavaScript - CRUD Operations
// ==========================================

// Live Django REST API on Render
const API_BASE =
  "https://employee-management-system-62xp.onrender.com/api/employees/";


// ==========================================
// DOM REFERENCES
// ==========================================

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


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, type = "success") {

  if (!messageBox) return;

  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove("hidden");

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 3000);
}


// ==========================================
// BUILD SEARCH QUERY
// ==========================================

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


// ==========================================
// READ - LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

  try {

    const response = await fetch(buildQuery());

    if (!response.ok) {
      throw new Error("Failed to load employees");
    }

    const employees = await response.json();

    renderTable(employees);

  } catch (error) {

    console.error("Load error:", error);

    showMessage(
      "Could not reach the server.",
      "error"
    );
  }
}


// ==========================================
// RENDER EMPLOYEE TABLE
// ==========================================

function renderTable(employees) {

  if (!tableBody) return;

  tableBody.innerHTML = "";


  // No employees

  if (!employees || employees.length === 0) {

    if (emptyState) {
      emptyState.classList.remove("hidden");
    }

    return;
  }


  if (emptyState) {
    emptyState.classList.add("hidden");
  }


  // Display employees

  employees.forEach((employee) => {

    const row = document.createElement("tr");

    row.innerHTML = `

      <td>
        ${escapeHtml(employee.full_name)}
      </td>

      <td>
        ${escapeHtml(employee.email)}
      </td>

      <td>
        ${escapeHtml(employee.phone_number)}
      </td>

      <td>
        ${escapeHtml(employee.department)}
      </td>

      <td>
        ${escapeHtml(employee.designation)}
      </td>

      <td>
        ${escapeHtml(employee.date_of_joining)}
      </td>

      <td>
        ₹${Number(employee.salary).toLocaleString("en-IN")}
      </td>

      <td>
        <span class="status-badge ${escapeHtml(employee.status)}">
          ${escapeHtml(employee.status)}
        </span>
      </td>

      <td class="actions-cell">

        <button
          class="edit-btn"
          data-id="${employee.id}">
          Edit
        </button>

        <button
          class="delete-btn"
          data-id="${employee.id}"
          data-name="${escapeHtml(employee.full_name)}">
          Delete
        </button>

      </td>

    `;

    tableBody.appendChild(row);

  });


  // ========================================
  // EDIT BUTTON
  // ========================================

  document.querySelectorAll(".edit-btn").forEach((button) => {

    button.addEventListener("click", () => {

      openEditModal(button.dataset.id);

    });

  });


  // ========================================
  // DELETE BUTTON
  // ========================================

  document.querySelectorAll(".delete-btn").forEach((button) => {

    button.addEventListener("click", () => {

      openDeleteModal(
        button.dataset.id,
        button.dataset.name
      );

    });

  });

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}


// ==========================================
// CREATE - OPEN ADD EMPLOYEE MODAL
// ==========================================

function openAddModal() {

  modalTitle.textContent = "Add Employee";

  employeeForm.reset();

  document.getElementById("employeeId").value = "";

  formError.classList.add("hidden");

  employeeModal.classList.remove("hidden");
}


// ==========================================
// UPDATE - OPEN EDIT MODAL
// ==========================================

async function openEditModal(id) {

  try {

    const response =
      await fetch(`${API_BASE}${id}/`);

    if (!response.ok) {
      throw new Error("Employee not found");
    }

    const employee =
      await response.json();


    modalTitle.textContent = "Edit Employee";


    // Database ID

    document.getElementById("employeeId").value =
      employee.id;


    // Employee ID

    const employeeCode =
      document.getElementById("employeeCode");

    if (employeeCode) {

      employeeCode.value =
        employee.employee_id || "";

    }


    // Full name

    document.getElementById("fullName").value =
      employee.full_name || "";


    // Email

    document.getElementById("email").value =
      employee.email || "";


    // Phone

    document.getElementById("phoneNumber").value =
      employee.phone_number || "";


    // Department

    document.getElementById("department").value =
      employee.department || "";


    // Designation

    document.getElementById("designation").value =
      employee.designation || "";


    // Employment type

    const employmentType =
      document.getElementById("employmentType");

    if (employmentType) {

      employmentType.value =
        employee.employment_type || "";

    }


    // Date of joining

    document.getElementById("dateOfJoining").value =
      employee.date_of_joining || "";


    // Salary

    document.getElementById("salary").value =
      employee.salary || "";


    // Status

    document.getElementById("status").value =
      employee.status || "";


    // Address

    const address =
      document.getElementById("address");

    if (address) {

      address.value =
        employee.address || "";

    }


    formError.classList.add("hidden");

    employeeModal.classList.remove("hidden");


  } catch (error) {

    console.error("Edit error:", error);

    showMessage(
      "Could not load employee details.",
      "error"
    );

  }

}


// ==========================================
// CLOSE EMPLOYEE MODAL
// ==========================================

function closeEmployeeModal() {

  employeeModal.classList.add("hidden");

}


// ==========================================
// CREATE / UPDATE EMPLOYEE
// ==========================================

employeeForm.addEventListener("submit", async (event) => {

  event.preventDefault();


  // Database ID for update

  const databaseId =
    document.getElementById("employeeId").value;


  // ========================================
  // EMPLOYEE ID
  // ========================================

  const employeeCodeField =
    document.getElementById("employeeCode");

  let employeeCode = "";

  if (employeeCodeField) {

    employeeCode =
      employeeCodeField.value.trim();

  }


  // Generate ID if empty

  if (!employeeCode) {

    employeeCode =
      "EMP" + Date.now().toString().slice(-6);

  }


  // ========================================
  // EMPLOYEE DATA
  // ========================================

  const payload = {

    employee_id:
      employeeCode,

    full_name:
      document.getElementById("fullName").value.trim(),

    email:
      document.getElementById("email").value.trim(),

    phone_number:
      document.getElementById("phoneNumber").value.trim(),

    department:
      document.getElementById("department").value,

    designation:
      document.getElementById("designation").value.trim(),

    employment_type:
      document.getElementById("employmentType")
        ? document.getElementById("employmentType").value
        : "Full Time",

    date_of_joining:
      document.getElementById("dateOfJoining").value,

    salary:
      document.getElementById("salary").value,

    status:
      document.getElementById("status").value,

    address:
      document.getElementById("address")
        ? document.getElementById("address").value.trim()
        : ""

  };


  // ========================================
  // CREATE OR UPDATE
  // ========================================

  const isEdit = Boolean(databaseId);

  const url = isEdit
    ? `${API_BASE}${databaseId}/`
    : API_BASE;

  const method = isEdit
    ? "PATCH"
    : "POST";


  try {

    const response = await fetch(url, {

      method: method,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(payload)

    });


    // ======================================
    // ERROR
    // ======================================

    if (!response.ok) {

      let errorData = {};

      try {

        errorData =
          await response.json();

      } catch {

        errorData = {};

      }


      console.error(
        "Server error:",
        errorData
      );


      const firstError =
        Object.values(errorData)[0];


      if (firstError) {

        formError.textContent =
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError);

      } else {

        formError.textContent =
          "Please check the employee details.";

      }


      formError.classList.remove("hidden");

      return;
    }


    // ======================================
    // SUCCESS
    // ======================================

    closeEmployeeModal();


    showMessage(

      isEdit
        ? "Employee updated successfully."
        : "Employee added successfully."

    );


    loadEmployees();


  } catch (error) {

    console.error(
      "Save error:",
      error
    );


    formError.textContent =
      "Network error. Please check the server.";

    formError.classList.remove("hidden");

  }

});


// ==========================================
// DELETE - OPEN DELETE MODAL
// ==========================================

function openDeleteModal(id, name) {

  pendingDeleteId = id;


  const deleteText =
    document.getElementById("deleteConfirmText");


  if (deleteText) {

    deleteText.textContent =
      `Are you sure you want to delete ${name}?`;

  }


  deleteModal.classList.remove("hidden");

}


// ==========================================
// CLOSE DELETE MODAL
// ==========================================

function closeDeleteModal() {

  pendingDeleteId = null;

  deleteModal.classList.add("hidden");

}


// ==========================================
// DELETE EMPLOYEE
// ==========================================

confirmDeleteBtn.addEventListener(
  "click",
  async () => {

    if (!pendingDeleteId) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_BASE}${pendingDeleteId}/`,
          {
            method: "DELETE"
          }
        );


      if (
        !response.ok &&
        response.status !== 204
      ) {

        throw new Error(
          "Delete failed"
        );

      }


      closeDeleteModal();


      showMessage(
        "Employee deleted successfully."
      );


      loadEmployees();


    } catch (error) {

      console.error(
        "Delete error:",
        error
      );


      showMessage(
        "Could not delete employee.",
        "error"
      );

    }

  }
);


// ==========================================
// EVENT LISTENERS
// ==========================================

addNewBtn.addEventListener(
  "click",
  openAddModal
);


cancelBtn.addEventListener(
  "click",
  closeEmployeeModal
);


cancelDeleteBtn.addEventListener(
  "click",
  closeDeleteModal
);


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      clearTimeout(searchDebounce);

      searchDebounce =
        setTimeout(
          loadEmployees,
          350
        );

    }
  );

}


// ==========================================
// DEPARTMENT FILTER
// ==========================================

if (departmentFilter) {

  departmentFilter.addEventListener(
    "change",
    loadEmployees
  );

}


// ==========================================
// STATUS FILTER
// ==========================================

if (statusFilter) {

  statusFilter.addEventListener(
    "change",
    loadEmployees
  );

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadEmployees();