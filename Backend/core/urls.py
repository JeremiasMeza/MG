from rest_framework.routers import DefaultRouter
from django.urls import path, include
from core.views import ProductViewSet, SaleViewSet, QuoteViewSet, SalesSummaryReportView, CategoryViewSet
from django.conf import settings
from django.conf.urls.static import static





router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'sales', SaleViewSet, basename='sales')
router.register(r'quotes', QuoteViewSet, basename='quotes')
path('reports/summary/', SalesSummaryReportView.as_view(), name='sales-summary-report')
router.register(r'categories', CategoryViewSet, basename='categories')

urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
