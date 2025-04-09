import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Component, OnInit} from '@angular/core';

declare var Razorpay: any;
@Component({
  selector: 'app-buyer-cart',
  templateUrl: './buyer-cart.component.html',
  styleUrls: ['./buyer-cart.component.css']
})
export class BuyerCartComponent implements OnInit {

  notifications:any[]=[];
  paidAuctions: number[]=[];
  owneditem:any[]=[];

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.fetchNotifications();
    this.fetchPaidAuctions();
    this.fetchOwnedItems();
  }
  fetchOwnedItems(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
  
    this.http.get<any[]>('http://127.0.0.1:8000/getOwneditems', { headers })
      .subscribe(
        (data) => {
          this.owneditem = data;
        },
        (error) => {
          console.error('Error fetching owned items:', error);
        }
      );
  }

  fetchPaidAuctions(): void {
    const token = localStorage.getItem('token');
    this.http.get<number[]>('http://127.0.0.1:8000/getPaidAuctions', { 
      headers: { Authorization: `Token ${token}` }
    }).subscribe(
      (response) => {
        this.paidAuctions = response;  // ✅ **Store paid auction IDs**
      },
      (error) => {
        console.error("Error fetching paid auctions:", error);
      }
    );
  }
  fetchNotifications(): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://127.0.0.1:8000/getNotifications', {
      headers: { Authorization: `Token ${token}` }
    }).subscribe(
      (data) => {
        this.notifications = data.filter(notification => notification.notification_type === 'payment_request');
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
  initiatePayment(notification:any): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
    this.http.post('http://127.0.0.1:8000/create_razorpay_order', { auction_id:notification.auction_id,amount: notification.price*100 }, { headers })
      .subscribe((response: any) => {
        console.log("Razorpay order created:", response);
        const options = {
          key: "rzp_test_UHM9dsUx58ZJVS",
          amount: response.amount,
          currency: 'INR',
          name: "Auction Payment",
          description: "Complete your auction purchase",
          order_id: response.order_id,
          handler: (paymentResponse: any) => {
            console.log(paymentResponse);
            this.verifyPayment(paymentResponse, notification.auction_id);
           
            console.log(notification.auction_id)
          },
          method: {
            netbanking: true,
            upi: true,  // Explicitly enable UPI
            card: true,
            wallet: true
          },
          prefill: {
            email: "akhilrajns2002@gmail.com",
            contact:'8547558027'
          },
          theme: {
            color: "#3399cc"
          }
        };
        const rzp = new Razorpay(options);
        rzp.open();
      }, error => {
        console.error("Error creating Razorpay order:", error);
      });
  }

  
  
  verifyPayment(paymentResponse: any, auction_id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });

    this.http.post('http://127.0.0.1:8000/verify_payment', 

      { payment_id: paymentResponse.razorpay_payment_id,
        order_id:paymentResponse.razorpay_order_id,
        signature: paymentResponse.razorpay_signature,
        auction_id: auction_id
      }, 
      { headers }
    ).subscribe(response => {
      console.log("Payment successful:", response);
      alert('Payment successfull')


      this.paidAuctions.push(auction_id);
      this.fetchNotifications();
    }, error => {
      console.error("Payment verification failed:", error);
    });
  }

}
