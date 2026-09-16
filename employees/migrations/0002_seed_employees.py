from django.db import migrations

SAMPLE_EMPLOYEES = [
    {
        "employee_id": "EMP1001", "employee_name": "Arun Kumar",
        "email": "arun.kumar@company.com", "phone_number": "9876543210",
        "department": "Engineering", "designation": "Software Engineer",
        "employment_type": "Full Time", "joining_date": "2023-06-12",
        "salary": "55000.00", "status": "Active", "address": "Karur, Tamil Nadu"
    },
    {
        "employee_id": "EMP1002", "employee_name": "Priya Sharma",
        "email": "priya.sharma@company.com", "phone_number": "9876543211",
        "department": "Human Resources", "designation": "HR Executive",
        "employment_type": "Full Time", "joining_date": "2022-08-20",
        "salary": "48000.00", "status": "Active", "address": "Coimbatore, Tamil Nadu"
    },
    {
        "employee_id": "EMP1003", "employee_name": "Kavin Raj",
        "email": "kavin.raj@company.com", "phone_number": "9876543212",
        "department": "Finance", "designation": "Financial Analyst",
        "employment_type": "Full Time", "joining_date": "2024-01-15",
        "salary": "52000.00", "status": "Active", "address": "Erode, Tamil Nadu"
    },
    {
        "employee_id": "EMP1004", "employee_name": "Harini Devi",
        "email": "harini.devi@company.com", "phone_number": "9876543213",
        "department": "Marketing", "designation": "Marketing Executive",
        "employment_type": "Full Time", "joining_date": "2023-11-03",
        "salary": "45000.00", "status": "On Leave", "address": "Tiruppur, Tamil Nadu"
    },
    {
        "employee_id": "EMP1005", "employee_name": "Sanjay Kumar",
        "email": "sanjay.kumar@company.com", "phone_number": "9876543214",
        "department": "Operations", "designation": "Operations Manager",
        "employment_type": "Full Time", "joining_date": "2021-04-26",
        "salary": "68000.00", "status": "Active", "address": "Namakkal, Tamil Nadu"
    },
    {
        "employee_id": "EMP1006", "employee_name": "Divya Sri",
        "email": "divya.sri@company.com", "phone_number": "9876543215",
        "department": "Engineering", "designation": "Data Analyst",
        "employment_type": "Full Time", "joining_date": "2024-07-08",
        "salary": "50000.00", "status": "Active", "address": "Salem, Tamil Nadu"
    },
    {
        "employee_id": "EMP1007", "employee_name": "Rohit Kumar",
        "email": "rohit.kumar@company.com", "phone_number": "9876543216",
        "department": "Information Technology", "designation": "System Administrator",
        "employment_type": "Contract", "joining_date": "2025-02-10",
        "salary": "46000.00", "status": "Active", "address": "Trichy, Tamil Nadu"
    },
    {
        "employee_id": "EMP1008", "employee_name": "Keerthana S",
        "email": "keerthana.s@company.com", "phone_number": "9876543217",
        "department": "Engineering", "designation": "UI/UX Designer",
        "employment_type": "Full Time", "joining_date": "2023-09-18",
        "salary": "47000.00", "status": "Inactive", "address": "Madurai, Tamil Nadu"
    },
]

def seed_employees(apps, schema_editor):
    Employee = apps.get_model("employees", "Employee")
    for employee in SAMPLE_EMPLOYEES:
        Employee.objects.get_or_create(
            employee_id=employee["employee_id"],
            defaults=employee,
        )

def remove_employees(apps, schema_editor):
    Employee = apps.get_model("employees", "Employee")
    Employee.objects.filter(
        employee_id__in=[e["employee_id"] for e in SAMPLE_EMPLOYEES]
    ).delete()

class Migration(migrations.Migration):
    dependencies = [("employees", "0001_initial")]
    operations = [migrations.RunPython(seed_employees, remove_employees)]
