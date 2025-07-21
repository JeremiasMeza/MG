from rest_framework import viewsets, permissions, generics
from users.models import User
from users.serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
)
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView


class IsSuperUser(permissions.BasePermission):
    """Allows access only to superusers."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

@extend_schema(tags=["Usuarios"])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
