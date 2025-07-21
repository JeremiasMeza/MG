from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    """UserManager with default admin role for superusers."""

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        return super().create_superuser(username, email=email, password=password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Jefe'),
        ('recepcionist', 'Recepcionista'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='recepcionist')
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    def __str__(self):
        return self.username
