from django.db import models
from django.contrib.auth.models import User

# Admin model is not explicitly needed as Django's admin panel can manage admin tasks

class Auction(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auctions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    image = models.ImageField(upload_to='auction_images/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)

    # def __str__(self):
    #     return self.title

class Bid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    bid_time = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"{self.bidder.username} - {self.bid_amount}"

class Payment(models.Model):
    auction = models.OneToOneField(Auction, on_delete=models.CASCADE, related_name='payment')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_successful = models.BooleanField(default=False)

    # def __str__(self):
    #     return f"Payment by {self.buyer.username} for {self.auction.title}"

# Extending User model with profile for additional details if necessary
class Role(models.Model):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )
    name=models.CharField(max_length=10,choices=ROLE_CHOICES,unique=True)    


class UserProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)

    def addrole(self,role_name):
        if role_name not in ['buyer','seller']:
            raise ValueError('roles are invalid')
        if role_name not in self.role:
            self.role.append(role_name)
            self.save()


    # def __str__(self):
    #     return f"{self.user.username} ({self.role})"
class Notification(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')  # Buyer
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=20, choices=[('payment_request', 'Payment Request')])

    def __str__(self):
        return f"Notification for {self.user.username} - {self.notification_type}"

 