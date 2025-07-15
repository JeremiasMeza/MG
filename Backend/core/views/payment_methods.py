from rest_framework import viewsets, permissions
from drf_spectacular.utils import extend_schema
from core.models import PaymentMethod
from core.serializers.payment_methods import PaymentMethodSerializer

@extend_schema(tags=["Métodos de Pago"])
class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
