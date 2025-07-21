from rest_framework import viewsets
from core.models import Sale
from core.serializers.sales import SaleSerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from django.template.loader import get_template
from xhtml2pdf import pisa
from rest_framework.response import Response
from django.conf import settings
import os

@extend_schema(tags=["Ventas"])
class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-sale_date')
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Registrar venta o listar historial")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['get'], url_path='export')
    def export_pdf(self, request, pk=None):
        sale = self.get_object()
        template = get_template('sales/ticket.html')
        logo_path = os.path.join(settings.BASE_DIR, 'static', 'logo.png')
        context = {
            'sale': sale,
            'logo_path': logo_path,
        }
        html = template.render(context)

        folder_path = os.path.join(settings.MEDIA_ROOT, 'sales')
        os.makedirs(folder_path, exist_ok=True)

        file_name = f"venta_{sale.id}.pdf"
        file_path = os.path.join(folder_path, file_name)

        with open(file_path, 'wb') as pdf_file:
            pisa.CreatePDF(html, dest=pdf_file)

        file_url = request.build_absolute_uri(settings.MEDIA_URL + f'sales/{file_name}')
        return Response({'pdf_url': file_url})
