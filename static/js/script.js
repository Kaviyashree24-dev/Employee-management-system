const API_URL = "/api/employees/";

let employees = [];
let deleteTargetId = null;

const $ = (selector) => document.querySelector(selector);


// ==============================
// PAGE LOAD
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    loadEmployees();
});


// ==============================
// EVENT HANDLERS
// ==============================

function bindEvents() {

    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            switchSection(button.dataset.section);
        });
    });

    $("#topAddBtn").addEventListener("click", () => {
        openEmployeeForm();
    });

    $("#dashboardAddBtn").addEventListener("click", () => {
        openEmployeeForm();
    });

    $("#emptyAddBtn").addEventListener("click", () => {
        openEmployeeForm();
    });

    $("#viewAllBtn").addEventListener("click", () => {
        switchSection("employees");
    });

    $("#employeeForm").addEventListener("submit", handleFormSubmit);

    $("#searchInput").addEventListener("input", renderEmployees);

    [
        "departmentFilter",
        "typeFilter",
        "statusFilter",
        "sortSelect"
    ].forEach(id => {
        $("#" + id).addEventListener("change", renderEmployees);
    });

    $("#clearFiltersBtn").addEventListener("click", clearFilters);

    $("#confirmDeleteBtn").addEventListener("click", deleteEmployee);

    document.querySelectorAll("[data-close]").forEach(button => {
        button.addEventListener("click", () => {
            closeModal(button.dataset.close);
        });
    });

    [
        "employeeId",
        "employeeName",
        "email",
        "phoneNumber",
        "department",
        "designation",
        "employmentType",
        "joiningDate",
        "salary",
        "status",
        "address"
    ].forEach(id => {

        const element = $("#" + id);

        if (element) {

            element.addEventListener("input", () => {
                clearFieldError(id);
            });

            element.addEventListener("change", () => {
                clearFieldError(id);
            });
        }
    });

    $("#mobileMenu").addEventListener("click", () => {
        $("#sidebar").classList.toggle("open");
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                overlay.classList.add("hidden");
            }

        });

    });
}


// ==============================
// LOAD EMPLOYEES
// ==============================

async function loadEmployees() {

    showLoading(true);

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load employee records.");
        }

        employees = await response.json();

        updateDashboard();
        populateDepartmentFilter();
        renderEmployees();

    } catch (error) {

        showMessage(error.message, "error");

        if ($("#recentEmployees")) {
            $("#recentEmployees").innerHTML = `
                <div class="state-box">
                    <p>Could not connect to the backend. Make sure Django is running.</p>
                </div>
            `;
        }

    } finally {

        showLoading(false);

    }
}


// ==============================
// DASHBOARD
// ==============================

function updateDashboard() {

    $("#totalEmployees").textContent = employees.length;

    $("#totalDepartments").textContent =
        new Set(
            employees
                .map(employee => employee.department)
                .filter(Boolean)
        ).size;

    $("#activeEmployees").textContent =
        employees.filter(employee => employee.status === "Active").length;

    $("#leaveEmployees").textContent =
        employees.filter(employee => employee.status === "On Leave").length;


    const recent = employees.slice(0, 5);


    $("#recentEmployees").innerHTML = recent.length

        ? recent.map(employee => `
            <div class="recent-item">

                <div class="avatar">
                    ${initials(employee.employee_name)}
                </div>

                <div class="recent-info">

                    <strong>
                        ${escapeHtml(employee.employee_name)}
                    </strong>

                    <small>
                        ${escapeHtml(employee.employee_id)}
                        ·
                        ${escapeHtml(employee.designation)}
                        ·
                        ${escapeHtml(employee.department)}
                    </small>

                </div>

                <span class="pill">
                    ${escapeHtml(employee.status)}
                </span>

            </div>
        `).join("")

        : `
            <div class="state-box">
                <p>No employees available yet.</p>
            </div>
        `;
}


// ==============================
// DEPARTMENT FILTER
// ==============================

function populateDepartmentFilter() {

    const current = $("#departmentFilter").value;

    const departments = [
        ...new Set(
            employees
                .map(employee => employee.department)
                .filter(Boolean)
        )
    ].sort();


    $("#departmentFilter").innerHTML =
        `<option value="">All Departments</option>` +

        departments.map(department => `
            <option value="${escapeAttribute(department)}">
                ${escapeHtml(department)}
            </option>
        `).join("");


    $("#departmentFilter").value = current;
}


// ==============================
// RENDER EMPLOYEE TABLE
// ==============================

function renderEmployees() {

    const search =
        $("#searchInput").value.trim().toLowerCase();

    const department =
        $("#departmentFilter").value;

    const type =
        $("#typeFilter").value;

    const status =
        $("#statusFilter").value;

    const sort =
        $("#sortSelect").value;


    let filtered = employees.filter(employee => {

        const searchableValues = [
            employee.employee_id,
            employee.employee_name,
            employee.email,
            employee.phone_number,
            employee.designation,
            employee.department
        ];


        const matchesSearch =
            !search ||
            searchableValues.some(value =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search)
            );


        return (
            matchesSearch &&
            (!department || employee.department === department) &&
            (!type || employee.employment_type === type) &&
            (!status || employee.status === status)
        );

    });


    // SORTING

    if (sort === "name") {

        filtered.sort((a, b) =>
            String(a.employee_name ?? "")
                .localeCompare(
                    String(b.employee_name ?? "")
                )
        );

    }


    if (sort === "salaryHigh") {

        filtered.sort(
            (a, b) =>
                Number(b.salary || 0) -
                Number(a.salary || 0)
        );

    }


    if (sort === "salaryLow") {

        filtered.sort(
            (a, b) =>
                Number(a.salary || 0) -
                Number(b.salary || 0)
        );

    }


    // SHOW / HIDE TABLE

    $("#tableWrap").classList.toggle(
        "hidden",
        filtered.length === 0
    );

    $("#emptyState").classList.toggle(
        "hidden",
        filtered.length !== 0
    );


    // TABLE DATA

    $("#employeeTableBody").innerHTML = filtered.map(employee => `

        <tr>

            <td>

                <div class="student-cell">

                    <div class="avatar">
                        ${initials(employee.employee_name)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(employee.employee_name)}
                        </strong>

                        <small>
                            ${escapeHtml(employee.employee_id)}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHtml(employee.email)}
            </td>


            <td>
                ${escapeHtml(employee.department)}
            </td>


            <td>
                ${escapeHtml(employee.designation)}
            </td>


            <td>
                ${escapeHtml(employee.employment_type)}
            </td>


            <td>

                <span class="pill ${statusClass(employee.status)}">
                    ${escapeHtml(employee.status)}
                </span>

            </td>


            <td>
                ₹${formatSalary(employee.salary)}
            </td>


            <td>

                <div class="actions">

                    <button
                        class="action-btn"
                        onclick="viewEmployee(${employee.id})">
                        View
                    </button>


                    <button
                        class="action-btn"
                        onclick="editEmployee(${employee.id})">
                        Edit
                    </button>


                    <button
                        class="action-btn delete"
                        onclick="confirmDelete(${employee.id})">
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    `).join("");
}


// ==============================
// SWITCH DASHBOARD / EMPLOYEES
// ==============================

function switchSection(section) {

    const dashboard =
        section === "dashboard";


    $("#dashboardSection").classList.toggle(
        "hidden",
        !dashboard
    );


    $("#employeesSection").classList.toggle(
        "hidden",
        dashboard
    );


    $("#pageTitle").textContent =
        dashboard ? "Dashboard" : "Employees";


    document.querySelectorAll(".nav-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === section
        );

    });


    $("#sidebar").classList.remove("open");
}


// ==============================
// OPEN ADD / EDIT FORM
// ==============================

function openEmployeeForm(employee = null) {

    clearFormErrors();

    $("#employeeForm").reset();


    const today =
        new Date().toISOString().split("T")[0];


    $("#joiningDate").max = today;


    if (employee) {

        $("#formEyebrow").textContent =
            "Update Record";

        $("#modalTitle").textContent =
            "Edit Employee";

        $("#saveBtn").textContent =
            "Update Employee";


        $("#employeeDbId").value =
            employee.id ?? "";

        $("#employeeId").value =
            employee.employee_id ?? "";

        $("#employeeName").value =
            employee.employee_name ?? "";

        $("#email").value =
            employee.email ?? "";

        $("#phoneNumber").value =
            employee.phone_number ?? "";

        $("#department").value =
            employee.department ?? "";

        $("#designation").value =
            employee.designation ?? "";

        $("#employmentType").value =
            employee.employment_type ?? "";

        $("#joiningDate").value =
            employee.joining_date ?? "";

        $("#salary").value =
            employee.salary ?? "";

        $("#status").value =
            employee.status ?? "";

        $("#address").value =
            employee.address ?? "";

    } else {

        $("#formEyebrow").textContent =
            "Create Record";

        $("#modalTitle").textContent =
            "Add Employee";

        $("#saveBtn").textContent =
            "Save Employee";

        $("#employeeDbId").value = "";

    }


    $("#employeeModal").classList.remove("hidden");

    $("#employeeId").focus();
}


// ==============================
// ADD / UPDATE EMPLOYEE
// ==============================

async function handleFormSubmit(event) {

    event.preventDefault();

    clearFormErrors();


    const payload = {

        employee_id:
            $("#employeeId").value.trim(),

        employee_name:
            $("#employeeName").value.trim(),

        email:
            $("#email").value.trim(),

        phone_number:
            $("#phoneNumber").value.trim(),

        department:
            $("#department").value,

        designation:
            $("#designation").value.trim(),

        employment_type:
            $("#employmentType").value,

        joining_date:
            $("#joiningDate").value,

        salary:
            $("#salary").value,

        status:
            $("#status").value,

        address:
            $("#address").value.trim()

    };


    if (!validateForm(payload)) {
        return;
    }


    const dbId =
        $("#employeeDbId").value;


    const responseUrl =
        dbId
            ? `${API_URL}${dbId}/`
            : API_URL;


    const method =
        dbId
            ? "PATCH"
            : "POST";


    const button =
        $("#saveBtn");


    button.disabled = true;

    button.textContent =
        dbId
            ? "Updating..."
            : "Saving...";


    try {

        const response =
            await fetch(responseUrl, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });


        const data =
            await response.json();


        if (!response.ok) {

            displayApiErrors(data);

            return;
        }


        closeModal("employeeModal");


        showToast(
            dbId
                ? "Employee updated successfully."
                : "Employee added successfully."
        );


        await loadEmployees();


        switchSection("employees");


    } catch (error) {

        showToast(
            "Could not connect to the backend.",
            "error"
        );

    } finally {

        button.disabled = false;

        button.textContent =
            dbId
                ? "Update Employee"
                : "Save Employee";
    }
}


// ==============================
// FORM VALIDATION
// ==============================

function validateForm(payload) {

    let valid = true;


    const required = [

        [
            "employeeId",
            !payload.employee_id,
            "Employee ID cannot be empty."
        ],

        [
            "employeeName",
            !payload.employee_name,
            "Employee Name cannot be empty."
        ],

        [
            "email",
            !payload.email,
            "Email cannot be empty."
        ],

        [
            "phoneNumber",
            !payload.phone_number,
            "Phone Number cannot be empty."
        ],

        [
            "department",
            !payload.department,
            "Department cannot be empty."
        ],

        [
            "designation",
            !payload.designation,
            "Designation cannot be empty."
        ],

        [
            "employmentType",
            !payload.employment_type,
            "Employment Type cannot be empty."
        ],

        [
            "joiningDate",
            !payload.joining_date,
            "Joining Date cannot be empty."
        ],

        [
            "salary",
            payload.salary === "" ||
            Number(payload.salary) < 0,
            "Salary must be zero or greater."
        ],

        [
            "status",
            !payload.status,
            "Status cannot be empty."
        ],

        [
            "address",
            !payload.address,
            "Address cannot be empty."
        ]

    ];


    required.forEach(
        ([id, bad, message]) => {

            if (bad) {

                setFieldError(
                    id,
                    message
                );

                valid = false;
            }

        }
    );


    // EMAIL

    if (
        payload.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            payload.email
        )
    ) {

        setFieldError(
            "email",
            "Enter a valid email address."
        );

        valid = false;
    }


    // PHONE

    if (
        payload.phone_number &&
        !/^\d{10}$/.test(
            payload.phone_number
        )
    ) {

        setFieldError(
            "phoneNumber",
            "Phone Number must contain exactly 10 digits."
        );

        valid = false;
    }


    // NAME

    if (
        payload.employee_name &&
        payload.employee_name.length < 2
    ) {

        setFieldError(
            "employeeName",
            "Employee Name must contain at least 2 characters."
        );

        valid = false;
    }


    // JOINING DATE

    const today =
        new Date().toISOString().split("T")[0];


    if (
        payload.joining_date &&
        payload.joining_date > today
    ) {

        setFieldError(
            "joiningDate",
            "Joining Date cannot be in the future."
        );

        valid = false;
    }


    return valid;
}


// ==============================
// API ERRORS
// ==============================

function displayApiErrors(data) {

    let shown = false;


    Object.entries(data || {}).forEach(
        ([field, errors]) => {

            const fieldMap = {

                employee_id: "employeeId",
                employee_name: "employeeName",
                phone_number: "phoneNumber",
                employment_type: "employmentType",
                joining_date: "joiningDate",
                salary: "salary",
                department: "department",
                designation: "designation",
                email: "email",
                status: "status",
                address: "address"

            };


            const id =
                fieldMap[field] || field;


            if (document.getElementById(id)) {

                setFieldError(
                    id,
                    Array.isArray(errors)
                        ? errors.join(" ")
                        : String(errors)
                );

                shown = true;
            }

        }
    );


    if (!shown) {

        showToast(
            "The server rejected the submitted data.",
            "error"
        );

    }
}


// ==============================
// VIEW EMPLOYEE
// ==============================

function viewEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {
        return;
    }


    $("#employeeDetails").innerHTML = [

        detail(
            "Employee ID",
            employee.employee_id
        ),

        detail(
            "Employee Name",
            employee.employee_name
        ),

        detail(
            "Email",
            employee.email
        ),

        detail(
            "Phone Number",
            employee.phone_number
        ),

        detail(
            "Department",
            employee.department
        ),

        detail(
            "Designation",
            employee.designation
        ),

        detail(
            "Employment Type",
            employee.employment_type
        ),

        detail(
            "Joining Date",
            formatDate(employee.joining_date)
        ),

        detail(
            "Salary",
            "₹" + formatSalary(employee.salary)
        ),

        detail(
            "Status",
            employee.status
        ),

        detail(
            "Address",
            employee.address,
            true
        )

    ].join("");


    $("#viewModal").classList.remove("hidden");
}


// ==============================
// EMPLOYEE DETAILS
// ==============================

function detail(label, value, full = false) {

    return `
        <div class="detail-item ${full ? "full" : ""}">

            <span>
                ${escapeHtml(label)}
            </span>

            <strong>
                ${escapeHtml(value)}
            </strong>

        </div>
    `;
}


// ==============================
// EDIT EMPLOYEE
// ==============================

function editEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );


    if (employee) {
        openEmployeeForm(employee);
    }
}


// ==============================
// DELETE CONFIRMATION
// ==============================

function confirmDelete(id) {

    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {
        return;
    }


    deleteTargetId = id;


    $("#deleteEmployeeName").textContent =
        employee.employee_name;


    $("#deleteModal").classList.remove("hidden");
}


// ==============================
// DELETE EMPLOYEE
// ==============================

async function deleteEmployee() {

    if (!deleteTargetId) {
        return;
    }


    const button =
        $("#confirmDeleteBtn");


    button.disabled = true;

    button.textContent =
        "Deleting...";


    try {

        const response =
            await fetch(
                `${API_URL}${deleteTargetId}/`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed."
            );
        }


        closeModal("deleteModal");


        showToast(
            "Employee deleted successfully."
        );


        deleteTargetId = null;


        await loadEmployees();


    } catch (error) {

        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Delete";
    }
}


// ==============================
// CLEAR FILTERS
// ==============================

function clearFilters() {

    $("#searchInput").value = "";

    $("#departmentFilter").value = "";

    $("#typeFilter").value = "";

    $("#statusFilter").value = "";

    $("#sortSelect").value = "newest";


    renderEmployees();
}


// ==============================
// FIELD ERROR
// ==============================

function setFieldError(id, message) {

    const element =
        $("#" + id);


    if (!element) {
        return;
    }


    const field =
        element.closest(".field");


    if (field) {
        field.classList.add("invalid");
    }


    const errorElement =
        $("#" + id + "Error");


    if (errorElement) {
        errorElement.textContent = message;
    }
}


// ==============================
// CLEAR FIELD ERROR
// ==============================

function clearFieldError(id) {

    const element =
        $("#" + id);


    if (!element) {
        return;
    }


    const field =
        element.closest(".field");


    if (field) {
        field.classList.remove("invalid");
    }


    const errorElement =
        $("#" + id + "Error");


    if (errorElement) {
        errorElement.textContent = "";
    }
}


// ==============================
// CLEAR ALL FORM ERRORS
// ==============================

function clearFormErrors() {

    [

        "employeeId",
        "employeeName",
        "email",
        "phoneNumber",
        "department",
        "designation",
        "employmentType",
        "joiningDate",
        "salary",
        "status",
        "address"

    ].forEach(clearFieldError);
}


// ==============================
// CLOSE MODAL
// ==============================

function closeModal(id) {

    const modal =
        $("#" + id);


    if (modal) {
        modal.classList.add("hidden");
    }
}


// ==============================
// LOADING
// ==============================

function showLoading(show) {

    const loading =
        $("#loadingState");


    if (loading) {

        loading.classList.toggle(
            "hidden",
            !show
        );

    }
}


// ==============================
// MESSAGE
// ==============================

function showMessage(message, type) {

    $("#messageArea").innerHTML = `

        <div class="inline-message ${type}">
            ${escapeHtml(message)}
        </div>

    `;
}


// ==============================
// TOAST
// ==============================

function showToast(message, type = "success") {

    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    toast.textContent =
        message;


    $("#toastContainer").appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3200);
}


// ==============================
// INITIALS
// ==============================

function initials(name) {

    return String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();
}


// ==============================
// STATUS CLASS
// ==============================

function statusClass(status) {

    if (status === "Active") {
        return "status-active";
    }

    if (status === "On Leave") {
        return "status-leave";
    }

    return "status-inactive";
}


// ==============================
// FORMAT SALARY
// ==============================

function formatSalary(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// ==============================
// FORMAT DATE
// ==============================

function formatDate(value) {

    if (!value) {
        return "";
    }


    return new Date(
        value + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ==============================
// ESCAPE HTML
// ==============================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            character => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            })[character]
        );
}


// ==============================
// ESCAPE ATTRIBUTE
// ==============================

function escapeAttribute(value) {

    return escapeHtml(value);
}