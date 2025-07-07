from rest_framework.routers import DefaultRouter
from django.urls import path, include
from core.views import ProductViewSet, SaleViewSet, QuoteViewSet




router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'sales', SaleViewSet, basename='sales')
router.register(r'quotes', QuoteViewSet, basename='quotes')

urlpatterns = [
    path('', include(router.urls)),
]
