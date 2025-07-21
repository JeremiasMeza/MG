from django.contrib.auth import get_user_model
from django.test import TestCase


class SuperuserRoleTest(TestCase):
    def test_create_superuser_role_is_admin(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(username="admin", password="pass")
        self.assertEqual(superuser.role, "admin")
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)
