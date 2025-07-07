from rest_framework import viewsets, permissions
from core.models import Product
from core.serializers.products import ProductSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Productos"])
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @extend_schema(
        summary="Lista y crea productos",
        description="Permite listar todos los productos o agregar uno nuevo"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(request={"multipart/form-data": ProductSerializer})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
