from rest_framework import viewsets, permissions
from core.models import Quote
from core.serializers.quotes import QuoteSerializer
from drf_spectacular.utils import extend_schema
from django.template.loader import get_template
from django.http import HttpResponse
from xhtml2pdf import pisa
from rest_framework.decorators import action
from django.conf import settings
from django.http import JsonResponse
import os
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@extend_schema(tags=["Cotizaciones"])
class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all().order_by('-created_at')
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='export')
    def export(self, request, pk=None):
        quote = self.get_object()
        template = get_template('quotes/pdf.html')
        html = template.render({'quote': quote})
        output_path = f'media/cotizaciones/cotizacion_{quote.id}.pdf'
        with open(output_path, "wb") as f:
            pisa.CreatePDF(html, dest=f)
        return Response({"pdf_url": request.build_absolute_uri(f"/media/cotizaciones/cotizacion_{quote.id}.pdf")})



@action(detail=True, methods=['get'], url_path='export')
def export_pdf(self, request, pk=None):
    quote = self.get_object()
    template = get_template('quotes/pdf.html')
    html = template.render({'quote': quote})

    # Carpeta y archivo destino
    folder_path = os.path.join(settings.MEDIA_ROOT, 'quotes')
    os.makedirs(folder_path, exist_ok=True)

    file_name = f"cotizacion_{quote.id}.pdf"
    file_path = os.path.join(folder_path, file_name)

    with open(file_path, "wb") as pdf_file:
        pisa.CreatePDF(html, dest=pdf_file)

    # Devolver la URL pública
    file_url = request.build_absolute_uri(f"{settings.MEDIA_URL}quotes/{file_name}")
    return JsonResponse({"message": "PDF generado correctamente", "url": file_url})