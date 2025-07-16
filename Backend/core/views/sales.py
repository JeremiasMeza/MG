from rest_framework import viewsets, permissions
from core.models import Sale
from core.serializers.sales import SaleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

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
        queryset = self.filter_queryset(self.get_queryset())

        limit = request.query_params.get('limit')
        if limit is not None and str(limit).isdigit():
            queryset = queryset[: int(limit)]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
