from rest_framework import viewsets
from core.models import Sale
from core.serializers.sales import SaleSerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Ventas"])
class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-sale_date')
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Registrar venta o listar historial",
        parameters=[
            OpenApiParameter(
                name='limit',
                type=int,
                required=False,
                description='Numero maximo de registros a retornar'
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
