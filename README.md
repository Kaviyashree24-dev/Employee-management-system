# Employee Management System

A complete full-stack, CRUD-based Web Application for managing employee records.

## Objective
The Employee Management System enables organizations to create, read, update, and delete employee records through a responsive frontend hosted on GitHub Pages connected to a Django REST Framework backend deployed on Render.

## Features
- Full CRUD operations (Create, Read, Update, Delete employees)
- Instant search by employee name, email, or employee ID
- Department filter (HR, IT, Sales, Finance, Operations)
- Status filter (Active, On Leave, Inactive)
- INR currency formatted salary display
- Add and Edit employee modal dialogs
- Delete confirmation modal dialog
- Validation for unique Employee ID and Email
- Responsive design for mobile and desktop screens

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend**: Python 3, Django, Django REST Framework
- **Database**: SQLite
- **Deployment**:
  - **Frontend**: GitHub Pages (`https://kaviyashree24-dev.github.io/Employee-management-system/`)
  - **Backend**: Render (`https://employee-management-system-62xp.onrender.com`)

## Employee Fields
- `employee_id`: Unique identifier (e.g. `EMP001`)
- `employee_name`: Full name of employee
- `email`: Unique email address
- `phone_number`: Contact phone number
- `department`: HR, IT, Sales, Finance, Operations
- `designation`: Job role or designation
- `employment_type`: Full Time, Part Time, Contract, Intern
- `joining_date`: Date of joining (`YYYY-MM-DD`)
- `salary`: Decimal monthly salary
- `status`: Active, On Leave, Inactive
- `address`: Residential address

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees/` | List all employees (supports `?search=`, `?department=`, `?status=`) |
| GET | `/api/employees/<id>/` | Retrieve individual employee details |
| POST | `/api/employees/` | Create a new employee |
| PUT | `/api/employees/<id>/` | Replace/update an existing employee |
| PATCH | `/api/employees/<id>/` | Partially update an employee record |
| DELETE | `/api/employees/<id>/` | Delete an employee record |

## Sample API JSON Payload
```json
{
  "employee_id": "EMP001",
  "employee_name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone_number": "9876543210",
  "department": "IT",
  "designation": "Senior Data Analyst",
  "employment_type": "Full Time",
  "joining_date": "2026-01-10",
  "salary": "55000.00",
  "status": "Active",
  "address": "Coimbatore, Tamil Nadu"
}
```

## How to Run Locally

### 1. Set up Virtual Environment
```bash
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Run Database Migrations
```bash
python manage.py migrate
```

### 4. Start Local Development Server
```bash
python manage.py runserver
```
- Local API Base: `http://127.0.0.1:8000/api/employees/`
- Local Admin: `http://127.0.0.1:8000/admin/`

## Deployment Details
- **GitHub Pages Frontend**: `https://kaviyashree24-dev.github.io/Employee-management-system/`
- **Render Backend**: `https://employee-management-system-62xp.onrender.com`
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt && python manage.py migrate`
  - Start Command: `gunicorn ems_project.wsgi:application --bind 0.0.0.0:$PORT`
