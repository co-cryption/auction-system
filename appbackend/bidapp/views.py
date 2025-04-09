from django.shortcuts import render
from rest_framework.permissions import AllowAny ,IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view,permission_classes
from .models import User , UserProfile,Role, Auction,Bid,Payment, Notification
from django.contrib.auth import authenticate,login,logout
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from .serializers import Userserializer,AuctionItemSerializer
from .utils import role_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#REGISTER USER
@api_view(['POST'])
@permission_classes([AllowAny])
def registeruser(request):
    first_name = request.data.get('firstname')
    last_name = request.data.get('lastname')
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role=request.data.get('role')   

    print(first_name,last_name,username,email,password,role)
    if not first_name or not last_name or not username or not email or not password:
        return Response({'message':'all fields are mandatory'}) 
    if role not in ['buyer','seller']:
        return Response({'message':'role is invalid'})
    # if User.objects.filter(username=username):
    #      return Response({'message':'User already exists'})

    # user = User.objects.create_user(first_name=first_name, last_name=last_name, username=username, email=email, password=password,is_active=False)
    # user_prof=UserProfile.objects.create(user=user)
    # user_prof.addrole(role)
    # return Response({'message':"user registered successfully, wait for admin approval"})

    user,created=User.objects.get_or_create(username=username,defaults={'first_name':first_name,'last_name':last_name,'email':email,'password':make_password(password),'is_active':False})

    user_profile, _ = UserProfile.objects.get_or_create(user=user)

    # Add role if it's not already assigned
    if role not in user_profile.role:
        user_profile.role.append(role)  # If using JSONField
        user_profile.save()
    return Response({'message': 'User registered successfully, wait for admin approval '})



#USER LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def loginuser(request):
    username=request.data.get('username')
    password=request.data.get('password')
    role=request.data.get('role')

    print(f'username:{username}')
    print(f'password:{password}')

    userpass= authenticate(username=username, password=password)
    
    print(userpass)
    if userpass is not None:

        #admin login
        if userpass.is_superuser:
           token,create= Token.objects.get_or_create(user=userpass)
           login(request,userpass)
           return Response({'message':'admin login successful','token':token.key, 'active_role':'admin'}) 
        #non-admin roles 
        user_roles=list(userpass.userprofile.role)
        print(user_roles)
        if role not in user_roles:
            return Response({'message':'role not assigned to user '})

        token,create= Token.objects.get_or_create(user=userpass)
        login(request,userpass)
        print(userpass.username)
        print(userpass.password)
        return Response({'message':'login successful','token':token.key, 'active_role':role,'roles':user_roles,'username':username})
    else:
        return Response({'message':'login failed !'})


#LOGOUT USER
@api_view(['POST'])
@permission_classes([IsAuthenticated])#prop of user obj that gives Tru if user is authenticated
def logoutuser(request):
    request.user.auth_token.delete()#to delete token , auth_token is property that stores token
    logout(request)
    return Response({'message':'Logging out'})


#ADD ITEM LISTING 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@role_required('seller')
def AuctionItemcreate(request):
    seller=request.user
    title= request.data.get('title')
    description=request.data.get('description')
    starting_price=request.data.get('starting_price')
    end_time=request.data.get('end_time')
    image=request.FILES.get('image')

    if not all([title,description,starting_price,end_time]):
        return Response({'message':'all fields are mandatory'})
    
    auction_item= Auction.objects.create(seller=seller,title=title,description=description,starting_price=starting_price,end_time=end_time,image=image)
    return Response({'message':'Item Listed successfully','item id':auction_item.id})

#UPDATE ITEM
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@role_required('seller')  # Only sellers can edit items
def edititem(request, item_id):
    try:
        auction_item = Auction.objects.get(id=item_id, seller=request.user)
    except Auction.DoesNotExist:
        return Response({'message': 'Item not found or not authorized!'}, status=404)

    auction_item.title = request.data.get('title', auction_item.title)
    auction_item.description = request.data.get('description', auction_item.description)
    auction_item.starting_price = request.data.get('starting_price', auction_item.starting_price)
    auction_item.end_time = request.data.get('end_time', auction_item.end_time)

    if 'image' in request.FILES:
        auction_item.image = request.FILES['image']

    auction_item.save()
    return Response({'message': 'Item updated successfully!'}, status=200)




#ADMIN CODE

# @api_view(['POST'])
# @permission_classes([IsAdminUser])
# def approveuser(request, uid):
#     user=User.objects.get(id=uid)
#     if user.is_active:
#         return Response({'message':'User already approved'})
#     user.is_active=True
#     user.save()
#     return Response({'message':'User approved'})

#VIEW USERS FROM ADMIN
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getuser(request):
    user=User.objects.all()
    serializer=Userserializer(user,many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approveuser(request):
    user_id=request.data.get('id')
    user=User.objects.get(id=user_id)
    user.is_active=not user.is_active
    user.save()
    return Response({'status':'user status updated'})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approveAuctionItem(request,item_id):
    aucion=Auction.objects.get(id=item_id)
    aucion.is_approved=not aucion.is_approved
    aucion.save()
    return Response({'message':'Item status updated'})


# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def getAuctionItems(request):
#     auction_items=Auction.objects.all()
#     serializer=AuctionItemSerializer(auction_items,many=True)
#     return Response(serializer.data)


#item api for admin only
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getAuctionItems(request):
    auction_items = Auction.objects.all()
    serializer = AuctionItemSerializer(auction_items, many=True)
    print(serializer.data)
    return Response(serializer.data)

#item api for expired and active items
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getallAuctionItems(request):
    auction_items = Auction.objects.all()

    auction_data = []
    for auction in auction_items:
        highest_bid = Bid.objects.filter(auction=auction).order_by('-bid_amount').first()
        payment_entry = Payment.objects.filter(auction=auction).first()

        auction_info = {
            "id": auction.id,
            "title": auction.title,
            "end_time": auction.end_time,
            "status": "Sold" if highest_bid else "Unsold",
            "buyer": highest_bid.bidder.username if highest_bid else None,
            "final_price": highest_bid.bid_amount if highest_bid else None,
            "payment_status": "Completed" if payment_entry and payment_entry.is_successful else "Pending" if payment_entry else "Not Required"
        }
        auction_data.append(auction_info)

    return Response(auction_data)






#item api for seller only
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getitemseller(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        if 'seller' not in user_profile.role:
            return Response({'error': 'Only sellers can access this'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    auction_items = Auction.objects.filter(seller=request.user)
    serializer = AuctionItemSerializer(auction_items, many=True)
    return Response(serializer.data)



#ITEM GET API FOR BUYER ONLY
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getitembuyer(request):
#     auction_items = Auction.objects.filter(is_approved=True, is_active=True)
#     serializer = AuctionItemSerializer(auction_items, many=True)
#     return Response(serializer.data)

# from django.utils.timezone import now
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getitembuyer(request):

#     current_time=now()
#     expired_auctions=Auction.objects.filter(end_time__lt=current_time,is_active=True)
#     for auction in expired_auctions:
#         highest_bid=Bid.objects.filter(auction=auction).order_by('-bid_amount').first()
#         if highest_bid:
#             # Create a payment entry for the highest bidder
#             Payment.objects.create(
#                 auction=auction,
#                 buyer=highest_bid.bidder,
#                 amount=highest_bid.bid_amount,
#                 is_successful=False  # Payment not completed yet
#             )
#         else:
#             print(f"Auction {auction.id} had no bids, item remains with seller.")

#         # Mark auction as ended
#         auction.is_active = False
#         auction.save()
   
#     auction_auctions = Auction.objects.filter(is_active=True)
#     serializer = AuctionItemSerializer(auction_auctions, many=True)
#     return Response(serializer.data)
from django.utils.timezone import now
from django.db import IntegrityError

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getitembuyer(request):
    print('Fetching auctions...')
    
    # Get all approved auctions
    auction_items = Auction.objects.filter(is_approved=True, is_active=True)
    print(f"Total active auctions found: {auction_items.count()}")

    for auction in auction_items:
        print(f"Checking auction {auction.id} with end time {auction.end_time}")

        # If the auction has ended
        if auction.end_time <= now():
            print(f"Auction {auction.id} has ended!")

            # Check if a payment entry already exists for this auction
            existing_payment = Payment.objects.filter(auction=auction).first()
            if existing_payment:
                print(f"Payment already exists for Auction {auction.id}, skipping...")
                continue  # Skip creating duplicate payments

            # Find the highest bid
            highest_bid = Bid.objects.filter(auction=auction).order_by('-bid_amount').first()

            if highest_bid:
                try:
                    # Create a payment entry (if it doesn't exist)
                    Payment.objects.create(
                        auction=auction,
                        buyer=highest_bid.bidder,
                        amount=highest_bid.bid_amount,
                        is_successful=False  # Payment pending
                    )
                    print(f"Payment created for Auction {auction.id}, Buyer: {highest_bid.bidder}")
                except IntegrityError:
                    print(f"Payment entry already exists for Auction {auction.id}, skipping...")
            else:
                print(f"No bids found for Auction {auction.id}, item remains with seller.")

            # Mark auction as ended
            auction.is_active = False
            auction.save()
            print(f"Auction {auction.id} marked as inactive.")

    # Return active auctions only
    active_auctions = Auction.objects.filter(is_active=True)
    return Response(AuctionItemSerializer(active_auctions, many=True).data)




# @api_view(['GET'])
# @permission_classes([AllowAny])
# def getAuctionItems(request):
#     user = request.user
#     try:
#         user_profile=UserProfile.objects.get(user=user)
#     except UserProfile.DoesNotExist:
#         return Response({'error':'user not found'})
#     user_roles=user_profile.role

#     if user.is_staff:  # Admin user
#         auction_items = Auction.objects.all()
#     elif 'seller' in user_roles:
#         auction_items=Auction.objects.filter(seller=user)
#     elif 'buyer' in user_roles:   #Buyer
#         auction_items = Auction.objects.filter(is_approved=True)
    
#     serializer = AuctionItemSerializer(auction_items, many=True)
#     return Response(serializer.data)



# @api_view(['GET'])
# @permission_classes([AllowAny])
# def getAuctionItems(request):
#     user = request.user
#     if user.is_staff:  # Admin user
#         auction_items = Auction.objects.all()
#     elif user.role=='seller': 
#         auction_items = Auction.objects.filter(seller=user)
#     else:
#         auction_items=Auction.objects.filter(is_approved=True)
    
#     serializer = AuctionItemSerializer(auction_items, many=True)
#     return Response(serializer.data)




#AUCTION ITEM UPDATE API
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware, is_naive, localtime

@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def updateAuctionItem(request,pk):
    try:
        auction_item=Auction.objects.get(id=pk,seller=request.user)
    except Auction.DoesNotExist:
        return Response({'error':'auction item not found'})
    data = request.data.copy()  
    print("Received Data:", data)

    if 'end_time' in data:
        end_time = parse_datetime(data['end_time'])
        if end_time and is_naive(end_time):  
            end_time = make_aware(end_time)

        auction_item.end_time = end_time

    serializer=AuctionItemSerializer(auction_item,data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        print("Updated End Time (IST):",localtime(auction_item.end_time))
        return  Response(serializer.data)
    else:
        print("Serializer Errors:", serializer.errors) 
        return Response(serializer.errors)


#AUCTION ITEM DELETE API
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteAuctionItem(request, pk):
    try:
        auction_item = Auction.objects.get(pk=pk, seller=request.user)
    except Auction.DoesNotExist:
        return Response({"error": "Auction item not found or unauthorized"})

    auction_item.delete()
    return Response({"message": "Auction item deleted successfully"})








#GET 1 ITEM DETAILED
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getDetailItem(request,auctionId):
#     try:
#         auction_item=Auction.objects.get(id=auctionId)
#     except Auction.DoesNotExist:
#         return Response({'error':'auction item not found'})
#     serializer=AuctionItemSerializer(auction_item)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDetailItem(request,auctionId):
    auction=Auction.objects.get(id=auctionId)
    logged_in_user = request.user.username  # Get currently logged-in user

    response_data = {
        "id": auction.id,
        "title": auction.title,
        "description": auction.description,
        "image": auction.image.url,
        "starting_price": auction.starting_price,
        "current_price":auction.current_price if auction.current_price > 0 else auction.starting_price,
        "end_time": auction.end_time,
        "seller_name": auction.seller.username,  # Seller's username
        "logged_in_user": logged_in_user,  # Add this to response
        "bids": list(auction.bids.values("bid_amount", "bid_time", "bidder__username"))
    }
    
    return JsonResponse(response_data,safe=False)




#PLACE BID
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bid(request):
    auction_id = request.data.get('auction_id')
    bid_amount = request.data.get('bid_amount')

    try:
        auction = Auction.objects.get(id=auction_id)

        if auction.seller == request.user:
            return Response({'error': 'You cannot bid on your own auction.'})

        if bid_amount <= auction.current_price:
            return Response({'error': 'Bid must be higher than current price'}, status=400)

        bid = Bid.objects.create(auction=auction, bidder=request.user, bid_amount=bid_amount)
        auction.current_price = bid_amount
        auction.save()

        return Response({'message': 'Bid placed successfully'})
    except Auction.DoesNotExist:
        return Response({'error': 'Auction not found'}, status=404)
    


#seller notifications
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSellerNotifications(request):
    print("Fetching ended auctions for seller...")

    # Get auctions that have ended (where `is_active=False`) for the logged-in seller
    ended_auctions = Auction.objects.filter(seller=request.user, is_active=False)

    auction_data = []
    for auction in ended_auctions:
        highest_bid = Bid.objects.filter(auction=auction).order_by('-bid_amount').first()
        payment_entry = Payment.objects.filter(auction=auction).first()

        payment_requested = Notification.objects.filter(
            auction=auction, 
            notification_type='payment_request'
        ).exists()

        if payment_entry and payment_entry.is_successful:
            payment_status="Payment complete"
        elif payment_entry:
            payment_status="Pending"
        else:
            payment_status = "Not Required"

        auction_info = {
            "id": auction.id,
            "title": auction.title,
            "end_time": auction.end_time,
            "status": "Sold" if highest_bid else "Unsold",
            "buyer": highest_bid.bidder.username if highest_bid else None,
            "final_price": highest_bid.bid_amount if highest_bid else None,
            "payment_status": payment_status,
            "payment_requested":payment_requested
        }
        auction_data.append(auction_info)

    return Response(auction_data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def requestPayment(request):
    auction_id = request.data.get('auction_id')
    if not auction_id:
            return Response({"error": "Auction ID is required"}, status=400)

    try:
        auction = Auction.objects.get(id=auction_id, seller=request.user, is_active=False)
        highest_bid = Bid.objects.filter(auction=auction).order_by('-bid_amount').first()

        
        if not highest_bid:
            return Response({"error": "No buyer found"}, status=400)

        # Check if a payment request notification already exists
        existing_notification = Notification.objects.filter(
            auction=auction, user=highest_bid.bidder, notification_type='payment_request'
        ).first()

        if existing_notification:
            return Response({"message": "Payment request already sent"}, status=200)

        # Create a new notification for the buyer
        Notification.objects.create(
            auction=auction,
            user=highest_bid.bidder,
            message=f"Payment request for '{auction.title}' - ₹{highest_bid.bid_amount}",
            notification_type='payment_request'
        )

        return Response({"message": "Payment request sent successfully"}, status=201)

    except Auction.DoesNotExist:
        return Response({"error": "Auction not found or not eligible for payment request"}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotifications(request):
    notifications=Notification.objects.filter(user=request.user)
    
    notifications_data=[
        {
            "id":notif.id,
            "auction_id":notif.auction.id,
            "message": notif.message,
            "notification_type": notif.notification_type,
            "price": Bid.objects.filter(auction=notif.auction).order_by('-bid_amount').first().bid_amount 
        if Bid.objects.filter(auction=notif.auction).exists() else None  
        }
        for notif in notifications
    ]
    return Response(notifications_data)




#RAZORPAY CODE IMPORTATNTTTTT
import razorpay
from django.conf import settings

client=razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    auction_id = request.data.get("auction_id")
    try:
        auction = Auction.objects.get(id=auction_id, is_active=False)
        highest_bid = auction.bids.order_by('-bid_amount').first()

        if not highest_bid or highest_bid.bidder != request.user:
            return Response({"error": "You are not authorized to make this payment"}, status=403)

        # Create a Razorpay order
        amount = int(highest_bid.bid_amount)  # Convert to paise
        order_data = {
            "amount": amount*100,
            "currency": "INR",
            "receipt": f"auction_{auction.id}",
            "payment_capture": "1",
        }
        order = client.order.create(order_data)
        print(f"Order ID: {order["id"]}")


        return Response({"order_id": order["id"], "amount": amount, "currency": "INR"}, status=201)

    except Auction.DoesNotExist:
        return Response({"error": "Auction not found"}, status=404)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        data = request.data
        print("Received data:", data)  # Debugging

        auction_id = request.data.get('auction_id')
        payment_id = request.data.get('payment_id')
        order_id = request.data.get('order_id')
        signature = request.data.get('signature')

        if not all([auction_id, payment_id, order_id, signature]):
            return Response({"error": "Missing payment details"}, status=400)
        
        auction = Auction.objects.get(id=auction_id, is_active=False)
        buyer = request.user

        # Verify payment signature with Razorpay
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }

        razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET))
        
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Razorpay Signature Verification Failed"}, status=400)
        
        payment = Payment.objects.get(auction=auction, buyer=buyer)
        payment.is_successful = True
        payment.save(update_fields=['is_successful'])

        return Response({"message": "Payment verified successfully"}, status=200)
    
        
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found for this auction"}, status=404)
    except Auction.DoesNotExist:
        return Response({"error": "Auction not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPaidAuctions(request):
    paid_auctions = Payment.objects.filter(buyer=request.user, is_successful=True).values_list('auction_id', flat=True)
    return Response(list(paid_auctions))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOwneditems(request):
    own_items=Payment.objects.filter(buyer_id=request.user,is_successful=True)
    owned_items = [
        {
            "id": payment.auction.id,
            "title": payment.auction.title,
            "price": payment.amount,
            "image": payment.auction.image.url if payment.auction.image else None,
        }
        for payment in own_items
    ]
    return Response(owned_items)

