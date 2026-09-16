from django.db import migrations, models
import django.core.validators

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("employee_id", models.CharField(max_length=20, unique=True)),
                ("employee_name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=150, unique=True)),
                ("phone_number", models.CharField(max_length=10, validators=[
                    django.core.validators.RegexValidator(
                        message="Phone number must contain exactly 10 digits.",
                        regex=r"^\d{10}$"
                    )
                ])),
                ("department", models.CharField(max_length=100)),
                ("designation", models.CharField(max_length=100)),
                ("employment_type", models.CharField(
                    choices=[("Full Time","Full Time"),("Part Time","Part Time"),("Contract","Contract"),("Intern","Intern")],
                    max_length=20
                )),
                ("joining_date", models.DateField()),
                ("salary", models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator(0)])),
                ("status", models.CharField(
                    choices=[("Active","Active"),("On Leave","On Leave"),("Inactive","Inactive")],
                    default="Active", max_length=20
                )),
                ("address", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
