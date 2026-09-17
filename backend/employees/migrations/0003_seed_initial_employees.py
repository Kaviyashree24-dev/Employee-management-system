from django.db import migrations


def seed_data(apps, schema_editor):
    Employee = apps.get_model('employees', 'Employee')
    if Employee.objects.count() == 0:
        Employee.objects.create(
            employee_id="EMP001",
            employee_name="Kanika",
            email="kanika@example.com",
            phone_number="9876543210",
            department="IT",
            designation="Software Engineer",
            employment_type="Full Time",
            joining_date="2025-01-15",
            salary="45000.00",
            status="Active",
            address="Coimbatore, Tamil Nadu"
        )
        Employee.objects.create(
            employee_id="EMP002",
            employee_name="Kaviyashree",
            email="kaviyashree@example.com",
            phone_number="9876543211",
            department="Finance",
            designation="Financial Analyst",
            employment_type="Full Time",
            joining_date="2025-03-10",
            salary="60000.00",
            status="Active",
            address="Karur, Tamil Nadu"
        )
        Employee.objects.create(
            employee_id="EMP003",
            employee_name="Rahul Kumar",
            email="rahul.kumar@example.com",
            phone_number="9876543212",
            department="IT",
            designation="Senior Data Analyst",
            employment_type="Full Time",
            joining_date="2025-06-01",
            salary="55000.00",
            status="Active",
            address="Chennai, Tamil Nadu"
        )
        Employee.objects.create(
            employee_id="EMP004",
            employee_name="Priya Dharshini",
            email="priya@example.com",
            phone_number="9876543213",
            department="HR",
            designation="HR Manager",
            employment_type="Full Time",
            joining_date="2024-11-20",
            salary="50000.00",
            status="Active",
            address="Madurai, Tamil Nadu"
        )


def remove_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_alter_employee_options_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_data, remove_data),
    ]
