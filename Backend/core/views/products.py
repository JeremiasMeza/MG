from rest_framework import viewsets
from core.models import Product
from core.serializers.products import ProductSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Productos"])
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @extend_schema(
        summary="Listar productos",
        description="Permite listar todos los productos o agregar uno nuevo"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
