from django.contrib import admin
from .models import User,Employee,Company,EmployeeDuty,Department

admin.site.register(Company)
admin.site.register(User)
admin.site.register(Employee)
admin.site.register(Department)

