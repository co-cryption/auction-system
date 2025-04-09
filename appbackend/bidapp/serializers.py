from rest_framework import serializers
from .models import Auction, User,Bid
from django.utils.timezone import localtime


class AuctionItemSerializer(serializers.ModelSerializer):
    
    buyer_username = serializers.SerializerMethodField()  # Fetch buyer's username
    current_price = serializers.SerializerMethodField()   # Ensure correct price
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    end_time = serializers.SerializerMethodField()

    def get_end_time(self, obj):
        return localtime(obj.end_time).isoformat() 
    class Meta:
        model = Auction
        fields = ['id', 'title', 'description', 'starting_price', 'current_price', 'image', 'end_time', 'buyer_username','is_approved','seller_name']

    def get_buyer_username(self, obj):
        highest_bid = obj.bids.order_by('-bid_amount').first()  # Get highest bid
        return highest_bid.bidder.username if highest_bid else "None"  # Return bidder username or "None"

    def get_current_price(self, obj):
        highest_bid = obj.bids.order_by('-bid_amount').first()  
        return highest_bid.bid_amount if highest_bid else obj.starting_price  # Show highest bid or starting price
    
class Userserializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        