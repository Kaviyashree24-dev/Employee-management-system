from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee

        fields = [
            'id',
            'employee_id',
            'employee_name',
            'email',
            'phone_number',
            'department',
            'designation',
            'employment_type',
            'joining_date',
            'salary',
            'status',
            'address',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]

    def validate_employee_id(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Employee ID cannot be empty."
            )
        return value.strip()

    def validate_employee_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Employee Name cannot be empty."
            )

        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Employee Name must contain at least 2 characters."
            )

        return value.strip()

    def validate_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Salary must be a positive number."
            )
        return value

    def validate_phone_number(self, value):
        digits = value.replace('+', '').replace('-', '').replace(' ', '')

        if not digits.isdigit() or len(digits) < 10:
            raise serializers.ValidationError(
                "Enter a valid phone number (at least 10 digits)."
            )

        return value

    def validate_joining_date(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError(
                "Joining date cannot be in the future."
            )
        return value