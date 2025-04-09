import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NotificationService } from 'src/app/notification.service';
interface EndedAuction {
  id: number;
  title: string;
  end_time: string;
  status: string;
  buyer?: string;
  final_price?: number;
  payment_status: string;
  payment_requested: boolean;
}

@Component({
  selector: 'app-seller-allnotif',
  templateUrl: './seller-allnotif.component.html',
  styleUrls: ['./seller-allnotif.component.css']
})
export class SellerAllnotifComponent implements OnInit {
  endedAuctions: EndedAuction[] = [];

  constructor(private http: HttpClient,private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchEndedAuctions();
  }

  fetchEndedAuctions(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Token ${token}`});

    this.http.get<EndedAuction[]>('http://127.0.0.1:8000/getSellerNotifications', { headers }).subscribe(
      (response) => {
        this.endedAuctions = response;
        console.log(this.endedAuctions);
        this.endedAuctions.forEach(auction => {
          if (auction.payment_status === 'Payment Complete') {
            this.updatePaymentStatus(auction.id, 'Payment Complete');
          }
        });
      },
      (error) => {
        console.error('Error fetching seller notifications:', error);
      }
    );
  }
  requestPayment(auction: any): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
  
    this.http.post('http://127.0.0.1:8000/requestPayment', { auction_id: auction.id }, { headers }).subscribe(
      (response: any) => {
        if (response.message === "Payment request sent successfully") {
          auction.payment_requested = true;
        }
      },
      (error) => {
        console.error("Error requesting payment", error);
      }
    );
  }

  updatePaymentStatus(auctionId: number, status: string): void {
    this.endedAuctions.forEach(auction => {
      if (auction.id === auctionId) {
        auction.payment_status = status;
      }
    });
  }
  
  
}
