from datetime import date
from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "id", "employee_id", "employee_name", "email", "phone_number",
            "department", "designation", "employment_type", "joining_date",
            "salary", "status", "address", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def validate_employee_id(self, value):
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Employee ID cannot be empty.")
        return value

    def validate_employee_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Employee Name cannot be empty.")
        if len(value) < 2:
            raise serializers.ValidationError("Employee Name must contain at least 2 characters.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if not value:
            raise serializers.ValidationError("Email cannot be empty.")
        return value

    def validate_phone_number(self, value):
        value = value.strip()
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone Number must contain exactly 10 digits.")
        return value

    def validate_department(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Department cannot be empty.")
        return value

    def validate_designation(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Designation cannot be empty.")
        return value

    def validate_address(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Address cannot be empty.")
        return value

    def validate_salary(self, value):
        if value < 0:
            raise serializers.ValidationError("Salary cannot be negative.")
        return value

    def validate_joining_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Joining Date cannot be in the future.")
        return value

    def validate_employment_type(self, value):
        if value not in dict(Employee.EMPLOYMENT_TYPES):
            raise serializers.ValidationError("Select a valid employment type.")
        return value

    def validate_status(self, value):
        if value not in dict(Employee.STATUS_CHOICES):
            raise serializers.ValidationError("Select a valid status.")
        return value
