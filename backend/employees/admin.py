from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = [
        'employee_id',
        'employee_name',
        'email',
        'department',
        'designation',
        'employment_type',
        'joining_date',
        'salary',
        'status',
    ]

    search_fields = [
        'employee_id',
        'employee_name',
        'email',
        'department',
        'designation',
    ]

    list_filter = [
        'department',
        'employment_type',
        'status',
    ]

    ordering = ['-created_at']