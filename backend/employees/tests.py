from datetime import date
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Employee


class EmployeeAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("employee-list")
        self.initial_count = Employee.objects.count()
        self.employee = Employee.objects.create(
            employee_id="TEST1001",
            employee_name="Test Employee",
            email="test.employee@example.com",
            phone_number="9876543210",
            department="Engineering",
            designation="Software Engineer",
            employment_type="Full Time",
            joining_date=date(2025, 6, 1),
            salary="45000.00",
            status="Active",
            address="Karur, Tamil Nadu",
        )

    def payload(self, employee_id="TEST1002", email="new.employee@example.com"):
        return {
            "employee_id": employee_id,
            "employee_name": "New Employee",
            "email": email,
            "phone_number": "9123456780",
            "department": "Human Resources",
            "designation": "HR Executive",
            "employment_type": "Full Time",
            "joining_date": "2025-07-15",
            "salary": "42000.00",
            "status": "Active",
            "address": "Coimbatore, Tamil Nadu",
        }

    def test_get_employees(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.initial_count + 1)

    def test_create_employee(self):
        response = self.client.post(self.list_url, self.payload(), format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), self.initial_count + 2)

    def test_duplicate_employee_id_rejected(self):
        response = self.client.post(self.list_url, self.payload(employee_id="TEST1001"), format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("employee_id", response.data)

    def test_duplicate_email_rejected(self):
        response = self.client.post(
            self.list_url,
            self.payload(employee_id="TEST1002", email="test.employee@example.com"),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_invalid_phone_rejected(self):
        data = self.payload()
        data["phone_number"] = "123"
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_future_joining_date_rejected(self):
        data = self.payload()
        data["joining_date"] = "2999-01-01"
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_negative_salary_rejected(self):
        data = self.payload()
        data["salary"] = "-100"
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_employee(self):
        url = reverse("employee-detail", args=[self.employee.id])
        response = self.client.patch(url, {"designation": "Senior Software Engineer"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employee.refresh_from_db()
        self.assertEqual(self.employee.designation, "Senior Software Engineer")

    def test_delete_employee(self):
        url = reverse("employee-detail", args=[self.employee.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Employee.objects.count(), self.initial_count)
