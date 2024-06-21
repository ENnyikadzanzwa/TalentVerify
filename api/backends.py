# talent_verify/backends.py
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class CustomBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password_hash):
                return user
        except User.DoesNotExist:
            return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
