# talent_verify/forms.py
from django import forms

class UploadFileForm(forms.Form):
    file = forms.FileField()


class SearchForm(forms.Form):
    query = forms.CharField(label='Search', max_length=100)

# talent_verify/forms.py
from django import forms
from .models import Company, Employee, User

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['company_name', 'registration_date', 'registration_number', 'address', 'contact_person', 'contact_phone', 'email']

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['employee_name', 'company', 'department', 'employee_number', 'role', 'start_date', 'end_date']

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password_hash', 'user_role', 'company']
        widgets = {
            'password_hash': forms.PasswordInput(),
        }

# talent_verify/forms.py
from django import forms
from django.contrib.auth.hashers import make_password
from .models import User, Company

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'user_role', 'company']
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password != confirm_password:
            raise forms.ValidationError("Password and Confirm Password do not match")
        
        return cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField(label="Username", max_length=254)
    password = forms.CharField(label="Password", widget=forms.PasswordInput)
