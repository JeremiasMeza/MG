from rest_framework import serializers
from core.models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
