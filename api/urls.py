from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *


router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'employee-duties', EmployeeDutyViewSet, basename='employee-duty')
router.register(r'users', UserViewSet, basename='user')
router.register(r'duties', EmployeeDutyViewSet)
router.register(r'experiences', EmployeeExperienceViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path('me/', current_user, name='current_user'),
    path('add_employee/', add_employee, name='add_employee'),
    path('bulk/', bulk_upload_employees, name='bulk_upload_employees'),
    path('company/', get_company_details, name='get_company_details'),
    path('department/<int:department_id>/employees/', department_employees, name='department_employees'),
    path('employee/<int:employee_id>/', get_employee_details, name='get_employee_details'),
]
