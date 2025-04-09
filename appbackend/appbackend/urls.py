"""
URL configuration for appbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from bidapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registeruser',views.registeruser,name="registeruser"),
    path('getuser',views.getuser,name="getuser"),
    path('approveuser',views.approveuser,name="approveuser"),
    path('loginuser',views.loginuser,name="loginuser"),
    path('logoutuser',views.logoutuser,name="logoutuser"),

    path('itemlisting',views.AuctionItemcreate,name="itemlisting"),
    path('getAuctionItems',views.getAuctionItems,name="getAuctionItems"),
    path('getallAuctionItems',views.getallAuctionItems,name="getallAuctionItems"),
    path('getitemseller',views.getitemseller,name="getitemseller"),
    path('getitembuyer',views.getitembuyer,name="getitembuyer"),

    path('editaucitem/<int:pk>',views.updateAuctionItem,name="editaucitem"),
    path('deleteItem/<int:pk>',views.deleteAuctionItem,name="deleteItem"),

    path('itemapprove/<int:item_id>',views.approveAuctionItem,name="itemapprove"),
    path('edititem/<int:item_id>',views.edititem,name="edititem"),
    path('getDetailItem/<int:auctionId>/',views.getDetailItem,name="getDetailItem"),
    
    path('place_bid',views.place_bid,name="place_bid"),
    path('getSellerNotifications',views.getSellerNotifications,name="getSellerNotifications"),
    path('getNotifications',views.getNotifications,name="getNotifications"),
    path('requestPayment',views.requestPayment,name="requestPayment"),
   
    path('create_razorpay_order',views.create_razorpay_order,name="create_razorpay_order"),
    path('verify_payment',views.verify_payment,name="verify_payment"),
    path('getPaidAuctions',views.getPaidAuctions,name="getPaidAuctions"),
    path('getOwneditems',views.getOwneditems,name="getOwneditems"),

]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
