from rest_framework import viewsets, permissions
from users.models import User
from users.serializers import UserSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Usuarios"])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
