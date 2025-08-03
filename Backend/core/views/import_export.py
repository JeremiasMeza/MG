import csv
from decimal import Decimal
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Product, Category
from users.views import IsSuperUser


class ProductImportExportView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        """Export products and categories as CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'
        writer = csv.writer(response)
        writer.writerow([
            'category',
            'name',
            'description',
            'sku',
            'barcode',
            'brand',
            'price',
            'cost',
            'stock',
            'stock_minimum',
            'unit',
        ])
        for p in Product.objects.select_related('category').all():
            writer.writerow([
                p.category.name if p.category else '',
                p.name,
                p.description or '',
                p.sku or '',
                p.barcode or '',
                p.brand or '',
                p.price,
                p.cost if p.cost is not None else '',
                p.stock,
                p.stock_minimum,
                p.unit or '',
            ])
        return response

    def post(self, request):
        """Import products and categories from uploaded CSV"""
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        data = file.read()
        try:
            decoded = data.decode('utf-8')
        except UnicodeDecodeError:
            decoded = data.decode('latin-1')
        decoded = decoded.splitlines()
        reader = csv.DictReader(decoded)
        created = 0
        for row in reader:
            cat_name = row.get('category', '').strip()
            if not cat_name:
                continue
            category, _ = Category.objects.get_or_create(name=cat_name)
            product = Product(
                name=row.get('name', '').strip(),
                description=row.get('description', '').strip() or None,
                sku=row.get('sku', '').strip() or None,
                barcode=row.get('barcode', '').strip() or None,
                brand=row.get('brand', '').strip() or None,
                price=Decimal(row.get('price') or '0'),
                cost=Decimal(row['cost']) if row.get('cost') else None,
                stock=int(row.get('stock') or 0),
                stock_minimum=int(row.get('stock_minimum') or 0),
                unit=row.get('unit', '').strip() or None,
                category=category,
                created_by=request.user,
            )
            product.save()
            created += 1
        return Response({'created': created})
