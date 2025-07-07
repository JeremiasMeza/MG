from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Jefe'),
        ('recepcionist', 'Recepcionista'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='recepcionist')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username
