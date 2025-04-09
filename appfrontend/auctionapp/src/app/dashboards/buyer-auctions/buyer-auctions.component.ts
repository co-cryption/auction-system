import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface AuctionItem{
  id:number;
  title:string;
  image:string;
  current_price:number;
  end_time:string;
}

@Component({
  selector: 'app-buyer-auctions',
  templateUrl: './buyer-auctions.component.html',
  styleUrls: ['./buyer-auctions.component.css']
})
export class BuyerAuctionsComponent  implements OnInit{

  auctions: AuctionItem[]=[];
  constructor(private http: HttpClient,public router:Router){}
  ngOnInit(): void {
    this.fetchAuctions();
  }

  fetchAuctions():void{
    const token=localStorage.getItem('token')
    const headers=new HttpHeaders({'Authorization':`Token ${token}`})
    
    this.http.get<AuctionItem[]>('http://127.0.0.1:8000/getitembuyer',{headers}).subscribe(
      (response)=>{
        const currentISTTime = new Date().getTime() + (5.5 * 60 * 60 * 1000);

        this.auctions = response.filter(auction => {
          const auctionEndTimeUTC = new Date(auction.end_time).getTime();
          const auctionEndTimeIST = auctionEndTimeUTC + (5.5 * 60 * 60 * 1000);
          return auctionEndTimeIST > currentISTTime; // Compare timestamps in Ist
        });

      console.log("Current UTC Timestamp:", currentISTTime);
      console.log("Auction End Time Timestamps (IST):", this.auctions.map(a => new Date(a.end_time).getTime() + (5.5 * 60 * 60 * 1000)));
      },
      (error)=>{
        console.error('error fetching auctions',error)
      }
    );
  }
}
