from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from django.db.models.functions import TruncDate
from drf_spectacular.utils import extend_schema, OpenApiParameter
from core.models import Sale, SaleDetail, Product
from datetime import datetime


@extend_schema(
    tags=["Reportes"],
    parameters=[
        OpenApiParameter(name='start_date', required=False, description='Fecha inicial (YYYY-MM-DD)'),
        OpenApiParameter(name='end_date', required=False, description='Fecha final (YYYY-MM-DD)'),
    ]
)
class SalesSummaryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        filters = {}
        if start_date:
            filters['sale_date__date__gte'] = start_date
        if end_date:
            filters['sale_date__date__lte'] = end_date

        sales = Sale.objects.filter(**filters)

        total_ventas = sales.aggregate(total=Sum('total'))['total'] or 0
        total_iva = sales.aggregate(iva=Sum('iva'))['iva'] or 0

        detalles = SaleDetail.objects.filter(sale__in=sales)

        total_costos = 0
        for d in detalles:
            if d.product.cost:
                total_costos += d.product.cost * d.quantity

        ganancia = total_ventas - total_costos
        margen = (ganancia / total_ventas * 100) if total_ventas else 0

        # Producto más vendido
        best = (
            detalles.values('product__name')
            .annotate(total_qty=Sum('quantity'))
            .order_by('-total_qty')
            .first()
        )
        best_product = (
            {'name': best['product__name'], 'quantity': best['total_qty']}
            if best
            else None
        )

        # Productos con stock bajo
        low_stock = (
            Product.objects.filter(stock__lt=F('stock_minimum'))
            .values('id', 'name', 'barcode', 'stock', 'stock_minimum')
        )

        # Ventas diarias para gráficos
        daily_sales = (
            sales.annotate(day=TruncDate('sale_date'))
            .values('day')
            .annotate(total=Sum('total'))
            .order_by('day')
        )

        return Response({
            'total_ventas': round(total_ventas, 2),
            'total_iva': round(total_iva, 2),
            'total_costos': round(total_costos, 2),
            'ganancia_neta': round(ganancia, 2),
            'margen_porcentual': round(margen, 2),
            'best_selling_product': best_product,
            'low_stock_products': list(low_stock),
            'daily_sales': list(daily_sales),
        })
