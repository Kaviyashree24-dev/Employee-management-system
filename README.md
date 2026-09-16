# Employee Management System – CRUD-Based Web Application

**VSB Skill Vault Activity 3 – Mini Web Application (CRUD-Based Web Application)**

## Overview
A professional full-stack Employee Management System built with HTML, CSS, JavaScript, Django, Django REST Framework and SQLite.

## Features
- Professional dashboard with live database statistics
- Add, view, edit and delete employees
- Search by employee ID, name, email, phone or designation
- Filter by department, employment type and status
- Sort records
- Frontend and backend validation
- Unique Employee ID and Email
- Delete confirmation modal
- Responsive design
- REST API
- Postman collection
- Django automated tests
- 8 sample employees
- GitHub-ready structure

## Technology
Frontend: HTML5, CSS3, JavaScript  
Backend: Python Django  
API: Django REST Framework  
Database: SQLite  
Testing: Postman + Django tests  
Version Control: Git/GitHub

## Employee fields
- Employee ID
- Employee Name
- Email
- Phone Number
- Department
- Designation
- Employment Type
- Joining Date
- Salary
- Status
- Address

## Run the project

### 1. Open the project folder in VS Code
Open `employee-management-system`.

### 2. Create virtual environment
Windows PowerShell:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Command Prompt:
```cmd
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Apply migrations
```bash
python manage.py migrate
```

The included database already contains sample employees. If `db.sqlite3` is deleted, the seed migration recreates them.

### 5. Start the server
```bash
python manage.py runserver
```

Open:
`http://127.0.0.1:8000/`

API:
`http://127.0.0.1:8000/api/employees/`

Admin:
`http://127.0.0.1:8000/admin/`

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees/` | List employees |
| POST | `/api/employees/` | Create employee |
| GET | `/api/employees/<id>/` | View employee |
| PUT | `/api/employees/<id>/` | Replace employee |
| PATCH | `/api/employees/<id>/` | Partially update |
| DELETE | `/api/employees/<id>/` | Delete employee |

## Example JSON
```json
{
  "employee_id": "EMP1009",
  "employee_name": "Meena Raj",
  "email": "meena.raj@example.com",
  "phone_number": "9876543299",
  "department": "Human Resources",
  "designation": "HR Executive",
  "employment_type": "Full Time",
  "joining_date": "2026-06-15",
  "salary": "42000.00",
  "status": "Active",
  "address": "Karur, Tamil Nadu"
}
```

## Test
```bash
python manage.py test
```

## GitHub
```bash
git init
git add .
git commit -m "Initial Employee Management System"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
