from rest_framework import viewsets, permissions
from core.models import Quote
from core.serializers.quotes import QuoteSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Cotizaciones"])
class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all().order_by('-created_at')
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
