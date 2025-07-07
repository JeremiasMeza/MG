from rest_framework import viewsets, permissions
from core.models import Product
from core.serializers.products import ProductSerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @extend_schema(summary="Lista y crea productos", description="Permite listar todos los productos o agregar uno nuevo")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
