from rest_framework import viewsets, permissions, generics
from users.models import User
from users.serializers import UserSerializer, UserRegistrationSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Usuarios"])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
