from rest_framework import viewsets, permissions
from core.models import Category
from core.serializers.categories import CategorySerializer
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Categorías"])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
