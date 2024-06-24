# models.py
from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from .utils import send_email
import random
import string

class EncryptedField(models.Field):
    def get_internal_type(self):
        return 'BinaryField'

    def get_prep_value(self, value):
        if value is None:
            return None
        fernet = Fernet(settings.ENCRYPTION_KEY.encode())
        return fernet.encrypt(value.encode())

    def from_db_value(self, value, expression, connection):
        if value is None:
            return None
        fernet = Fernet(settings.ENCRYPTION_KEY.encode())
        return fernet.decrypt(value).decode()

class Company(models.Model):
    company_id = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=100)
    registration_date = models.DateField()
    registration_number = EncryptedField()
    address = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    contact_phone = EncryptedField()
    email = EncryptedField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    department_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def employee_count(self):
        return Employee.objects.filter(department=self).count()
    
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
    department = models.ForeignKey('Department', on_delete=models.CASCADE)
    employee_name = models.CharField(max_length=100)
    employee_number = models.CharField(max_length=100, unique=True, null=True, blank=True)
    role = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    email = models.EmailField()
    gender = models.CharField(max_length=10)
    date_of_birth = EncryptedField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmployeeDuty(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    duty = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    user_role = models.CharField(max_length=20, choices=[
        ('company_admin', 'Company Administrator'),
        ('hr_manager', 'HR Manager/Staff'),
        ('it_admin', 'IT Administrator'),
        ('company_executive', 'Company Executive'),
        ('employee', 'Employee'),
        ('auditor', 'Auditor/Compliance Officer')
    ])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email



class EmployeeExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.employee_name} - {self.company} - {self.role}"
