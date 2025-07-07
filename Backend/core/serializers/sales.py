from rest_framework import serializers
from core.models import Sale, SaleDetail, Product


class SaleDetailSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = SaleDetail
        fields = ['product_id', 'quantity', 'price_unit', 'subtotal', 'iva']


class SaleSerializer(serializers.ModelSerializer):
    details = SaleDetailSerializer(many=True)
    agent = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Sale
        fields = [
            'id', 'agent', 'client_first_name', 'client_last_name',
            'client_rut', 'client_email', 'payment_method', 'sale_date',
            'total', 'iva', 'details'
        ]
        read_only_fields = ['total', 'iva', 'sale_date']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        sale = Sale.objects.create(**validated_data)

        total = 0
        iva_total = 0
        for item in details_data:
            product = Product.objects.get(pk=item['product_id'])
            quantity = item['quantity']
            price = product.price
            subtotal = round(price * quantity, 2)
            iva = round(subtotal * 0.19, 2)

            # Descontar stock
            product.stock -= quantity
            product.save()

            SaleDetail.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                price_unit=price,
                subtotal=subtotal,
                iva=iva
            )
            total += subtotal
            iva_total += iva

        sale.total = total
        sale.iva = iva_total
        sale.save()
        return sale
