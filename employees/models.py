from django.core.validators import MinValueValidator, RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r"^\d{10}$",
    message="Phone number must contain exactly 10 digits.",
)

class Employee(models.Model):
    EMPLOYMENT_TYPES = [
        ("Full Time", "Full Time"),
        ("Part Time", "Part Time"),
        ("Contract", "Contract"),
        ("Intern", "Intern"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("On Leave", "On Leave"),
        ("Inactive", "Inactive"),
    ]

    employee_id = models.CharField(max_length=20, unique=True)
    employee_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    phone_number = models.CharField(max_length=10, validators=[phone_validator])
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES)
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.employee_id} - {self.employee_name}"
