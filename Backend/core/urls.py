from rest_framework.routers import DefaultRouter
from django.urls import path, include
from core.views import ProductViewSet, SaleViewSet, QuoteViewSet, SalesSummaryReportView, CategoryViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'sales', SaleViewSet, basename='sales')
router.register(r'quotes', QuoteViewSet, basename='quotes')
router.register(r'categories', CategoryViewSet, basename='categories')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/summary/', SalesSummaryReportView.as_view(), name='sales-summary-report'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
