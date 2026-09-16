# Employee Management System – Project Documentation

## 1. Title
**Employee Management System – CRUD-Based Web Application**

VSB Skill Vault Activity 3 – Mini Web Application

## 2. Problem Statement
Organizations need an organized way to maintain employee information. Manual records can make searching, editing and maintaining employee details difficult. This system provides a centralized interface connected to a real database.

## 3. Objectives
1. Build a professional CRUD web application.
2. Implement Create, Read, Update and Delete operations.
3. Connect the frontend to a Django REST API.
4. Store employee data in SQLite.
5. Apply frontend and backend validation.
6. Provide search, filtering and sorting.
7. Test the API using Postman.
8. Prepare a GitHub-ready submission.

## 4. Technology Stack
HTML5, CSS3, JavaScript, Python, Django, Django REST Framework, SQLite, Postman and Git/GitHub.

## 5. Architecture
```text
User
  ↓
HTML + CSS + JavaScript
  ↓ fetch()
Django REST Framework
  ↓
Django ORM
  ↓
SQLite Database
```

## 6. Employee Database
Fields: id, employee_id, employee_name, email, phone_number, department, designation, employment_type, joining_date, salary, status, address, created_at.

Employee ID and email are unique. Required fields are validated. Phone numbers must contain 10 digits. Salary cannot be negative. Joining date cannot be in the future.

## 7. CRUD
Create: POST `/api/employees/`
Read: GET `/api/employees/` and `/api/employees/<id>/`
Update: PUT/PATCH `/api/employees/<id>/`
Delete: DELETE `/api/employees/<id>/`

## 8. UI Features
Dashboard cards, employee table, search, department/type/status filters, sorting, responsive layout, add/edit forms, view modal, delete confirmation, success/error messages and loading/empty states.

## 9. API Testing
Use the included `postman_collection.json` to demonstrate all CRUD endpoints and validation errors.

## 10. Testing Scenarios
- Add valid employee
- View employee
- Update employee
- Delete employee
- Search employee
- Filter employee
- Sort by salary/name
- Empty required fields
- Invalid email
- Invalid phone
- Negative salary
- Future joining date
- Duplicate Employee ID
- Duplicate Email

## 11. Future Enhancements
Authentication and roles, attendance, leave management, payroll, export to Excel/PDF, pagination, analytics and cloud deployment.

## 12. Conclusion
The project demonstrates a complete CRUD-based full-stack application with a responsive frontend, REST API, database persistence, validation, testing and documentation.
