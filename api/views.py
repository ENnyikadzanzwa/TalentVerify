from rest_framework import permissions,viewsets
from .models import Company, Department, Employee, EmployeeDuty, User, EmployeeExperience
from .serializers import CompanySerializer, DepartmentSerializer, EmployeeSerializer, EmployeeDutySerializer, UserSerializer, EmployeeExperienceSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
import csv
import random
import string
from cryptography.fernet import Fernet
from django.conf import settings
from .utils import send_email


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Department.objects.filter(company=user.company)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(company=user.company)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_employees(request):
    user = request.user
    employees = Employee.objects.filter(company=user.company).select_related('department')
    employee_data = []
    for employee in employees:
        employee_data.append({
            'employee_id': employee.employee_id,
            'employee_name': employee.employee_name,
            'employee_number': employee.employee_number,
            'department_id': employee.department.department_id,
            'department_name': employee.department.department_name,
            'role': employee.role,
            'start_date': employee.start_date,
            'email': employee.email,
            'gender': employee.gender,
            'date_of_birth': employee.get_decrypted_dob(),
        })
    return Response(employee_data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieve_employee(request, pk):
    try:
        employee = Employee.objects.get(pk=pk, company=request.user.company)
    except Employee.DoesNotExist:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    duties = EmployeeDuty.objects.filter(employee=employee)
    experiences = EmployeeExperience.objects.filter(employee=employee)

    employee_data = {
        'employee_id': employee.employee_id,
        'employee_name': employee.employee_name,
        'employee_number': employee.employee_number,
        'role': employee.role,
        'email': employee.email,
        'gender': employee.gender,
        'date_of_birth': employee.get_decrypted_dob(),
        'duties': EmployeeDutySerializer(duties, many=True).data,
        'experiences': EmployeeExperienceSerializer(experiences, many=True).data,
    }

    return Response(employee_data)


class EmployeeDutyViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDuty.objects.all()
    serializer_class = EmployeeDutySerializer


class EmployeeExperienceViewSet(viewsets.ModelViewSet):
    queryset = EmployeeExperience.objects.all()
    serializer_class = EmployeeExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return EmployeeExperience.objects.filter(employee__user=user)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(employee=user.employee)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'  # Add this line to look up users by their username

    def retrieve(self, request, *args, **kwargs):
        username = kwargs.get('username')
        user = User.objects.filter(username=username).first()
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def register_user(request):
    company_data = {
        'company_name': request.data['company_name'],
        'registration_date': request.data['registration_date'],
        'registration_number': request.data['registration_number'],
        'address': request.data['address'],
        'contact_person': request.data['contact_person'],
        'contact_phone': request.data['contact_phone'],
        'email': request.data['email']
    }
    company_serializer = CompanySerializer(data=company_data)
    if company_serializer.is_valid():
        company = company_serializer.save()

        user_data = {
            'username': request.data['username'],
            'password': make_password(request.data['password']),
            'email': request.data['email'],
            'company': company.company_id,
            'user_role': 'company_admin'  # or any role you want to set by default
        }
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'company_id': user.company.company_id,
        'user_role': user.user_role
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_employee(request):
    employee_data = {
        'employee_name': request.data['employee_name'],
        'employee_number': request.data['employee_number'],
        'department': request.data['department'],
        'role': request.data['role'],
        'start_date': request.data['start_date'],
        'email': request.data['email'],
        'gender': request.data['gender'],
        'date_of_birth': Fernet(settings.ENCRYPTION_KEY.encode()).encrypt(request.data['date_of_birth'].encode()).decode('utf-8'),
        'company': request.user.company.company_id
    }
    employee_serializer = EmployeeSerializer(data=employee_data)
    if employee_serializer.is_valid():
        employee = employee_serializer.save()

        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        user_data = {
            'username': employee.employee_number,
            'password': make_password(password),
            'email': employee.email,
            'company': employee.company.company_id,
            'user_role': employee.role
        }
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            send_email(
                employee.email,
                'Your account has been created',
                f'Your login details:\nUsername: {employee.employee_number}\nPassword: {password}'
            )
            return Response(employee_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_upload_employees(request):
    file = request.FILES['file']
    decoded_file = file.read().decode('utf-8').splitlines()
    reader = csv.DictReader(decoded_file)

    department_id = request.data.get('department')
    try:
        department = Department.objects.get(pk=department_id)
    except Department.DoesNotExist:
        return Response({'detail': f'Department with ID {department_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

    employees = []
    skipped_employees = []
    for row in reader:
        employee_number = row['employee_number']

        if Employee.objects.filter(employee_number=employee_number).exists():
            skipped_employees.append(f"{row['employee_name']} (Employee Number: {employee_number}) - Duplicate employee number")
            continue

        email = row['email']
        date_of_birth = row['date_of_birth'].encode()

        employee_data = {
            'employee_name': row['employee_name'],
            'employee_number': employee_number,
            'department': department.department_id,
            'role': row['role'],
            'start_date': row['start_date'],
            'email': email,
            'gender': row['gender'],
            'date_of_birth': Fernet(settings.ENCRYPTION_KEY.encode()).encrypt(date_of_birth).decode('utf-8'),  # Encrypt and decode to store as string
            'company': request.user.company.company_id
        }
        employee_serializer = EmployeeSerializer(data=employee_data)
        if employee_serializer.is_valid():
            employee = employee_serializer.save()

            # Create user for employee
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            user_data = {
                'username': employee.employee_number,
                'password': make_password(password),
                'email': employee.email,
                'company': employee.company.company_id,
                'user_role': employee.role
            }
            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                send_email(
                    employee.email,
                    'Your account has been created',
                    f'Your login details:\nUsername: {employee.employee_number}\nPassword: {password}'
                )
                employees.append(employee)
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'detail': 'Employees uploaded successfully.',
        'skipped_employees': skipped_employees
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_employees(request, department_id):
    try:
        department = Department.objects.get(pk=department_id, company=request.user.company)
    except Department.DoesNotExist:
        return Response({'detail': 'Department not found.'}, status=404)
    
    employees = Employee.objects.filter(department=department)
    employee_data = []
    for employee in employees:
        duties = EmployeeDuty.objects.filter(employee=employee)
        experiences = EmployeeExperience.objects.filter(employee=employee)
        fernet = Fernet(settings.ENCRYPTION_KEY.encode())
        decrypted_dob = fernet.decrypt(employee.date_of_birth.encode()).decode()
        employee_data.append({
            'employee_id': employee.employee_id,
            'employee_name': employee.employee_name,
            'employee_number': employee.employee_number,
            'role': employee.role,
            'email': employee.email,
            'gender': employee.gender,
            'date_of_birth': decrypted_dob,
            'duties': EmployeeDutySerializer(duties, many=True).data,
            'experiences': EmployeeExperienceSerializer(experiences, many=True).data,
        })
    
    return Response(employee_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_details(request):
    company = request.user.company
    serializer = CompanySerializer(company)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee_details(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id, company=request.user.company)
    except Employee.DoesNotExist:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    duties = EmployeeDuty.objects.filter(employee=employee)
    experiences = EmployeeExperience.objects.filter(employee=employee)
    
    employee_data = {
        'employee_id': employee.employee_id,
        'employee_name': employee.employee_name,
        'employee_number': employee.employee_number,
        'role': employee.role,
        'email': employee.email,
        'gender': employee.gender,
        'date_of_birth': employee.get_decrypted_dob(),  # Use the method here
        'duties': EmployeeDutySerializer(duties, many=True).data,
        'experiences': EmployeeExperienceSerializer(experiences, many=True).data,
    }
    
    return Response(employee_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    new_password = request.data.get('new_password')

    if not new_password:
        return Response({'detail': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)
