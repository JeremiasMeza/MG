from rest_framework import serializers
from core.models import Quote, QuoteDetail, Product
from decimal import Decimal


class QuoteDetailSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = QuoteDetail
        fields = ['product_id', 'quantity', 'price_unit', 'subtotal', 'iva']
        read_only_fields = ['price_unit', 'subtotal', 'iva']


class QuoteSerializer(serializers.ModelSerializer):
    details = QuoteDetailSerializer(many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Quote
        fields = [
            'id', 'client_name', 'client_rut', 'client_email',
            'created_by', 'created_at', 'expiration_date',
            'subtotal', 'iva', 'total', 'details'
        ]
        read_only_fields = ['created_at', 'subtotal', 'iva', 'total']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        quote = Quote.objects.create(**validated_data)

        subtotal_total = 0
        iva_total = 0
        for item in details_data:
            product = Product.objects.get(pk=item['product_id'])
            quantity = item['quantity']
            price = product.price
            subtotal = round(price * quantity, 2)
            iva = round(subtotal * Decimal("0.19"), 2)

            QuoteDetail.objects.create(
                quote=quote,
                product=product,
                quantity=quantity,
                price_unit=price,
                subtotal=subtotal,
                iva=iva
            )

            subtotal_total += subtotal
            iva_total += iva

        quote.subtotal = subtotal_total
        quote.iva = iva_total
        quote.total = subtotal_total + iva_total
        quote.save()

        return quote
