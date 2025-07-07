from rest_framework.routers import DefaultRouter
from django.urls import path, include
from core.views import ProductViewSet, SaleViewSet


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'sales', SaleViewSet, basename='sales')

urlpatterns = [
    path('', include(router.urls)),
]
