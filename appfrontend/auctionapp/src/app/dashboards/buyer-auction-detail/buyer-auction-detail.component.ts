import { Component , OnInit} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

 interface Bid{
  bid_amount: number;
  bid_time:string;
  bidder__username:string;
 }

 interface Auction {
  id: number;
  title: string;
  description: string;
  image: string;
  starting_price: number;
  current_price: number;
  end_time: string;
  seller_name:string;
  bids: Bid[];
 }
@Component({
  selector: 'app-buyer-auction-detail',
  templateUrl: './buyer-auction-detail.component.html',
  styleUrls: ['./buyer-auction-detail.component.css']
})
export class BuyerAuctionDetailComponent implements OnInit {

  auction:Auction|null = null;
  newBidAmount:number=0;

  active_role: string | null = null;  
  logged_in_user: string | null = null;  
  
  
  watchlist: Auction[]=[];
   constructor (private route: ActivatedRoute,private http: HttpClient,private router: Router) {}
   
  ngOnInit(): void {

    this.active_role = localStorage.getItem('role');  // Get active_role from localStorage
   
 // Debugging
    console.log("Active Role:", this.active_role); 

const storedWatchlist=localStorage.getItem('watchlist');
if (storedWatchlist) {
  this.watchlist = JSON.parse(storedWatchlist);
}


    const auctionId = this.route.snapshot.paramMap.get('id');
    if (auctionId) {
      this.fetchAuctionDetails(parseInt(auctionId));
    }
   }


   fetchAuctionDetails(auctionId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization':`Token ${token}`});
    this.http.get<Auction & {logged_in_user:string}>(`http://127.0.0.1:8000/getDetailItem/${auctionId}/`,{headers})
      .subscribe(
        (response) => {
          console.log('Auction details', response);
          this.auction = response;
          this.logged_in_user = response.logged_in_user;
          console.log('loggeduser:',this.logged_in_user);
          console.log('auction:',this.auction)
         },
        (error) => { console.error('Error fetching auction details', error); }
      );
  }

  placeBid(): void {
    if (this.auction && this.newBidAmount > this.auction.current_price) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });

      this.http.post(`http://127.0.0.1:8000/place_bid`, 
        { auction_id: this.auction.id, bid_amount: this.newBidAmount, bidder_username: this.logged_in_user}, 
        { headers })
        .subscribe(
          () => {
            alert('Bid placed successfully!');
            this.fetchAuctionDetails(this.auction!.id);
          },
          (error) => {
            alert('Error placing bid');
            console.error(error);
          }
        );
    } else {
      alert('Bid must be higher than current price');
    }
  }

  toggleWatchlist(auction:Auction): void {
    const index = this.watchlist.findIndex(item => item.id === auction.id);
    if (index > -1) {
      this.watchlist.splice(index, 1); // Remove from watchlist
    } else {
      this.watchlist.push(auction); // Add to watchlist
    }
    localStorage.setItem("watchlist", JSON.stringify(this.watchlist));
  }
  
  isInWatchlist(auction: Auction): boolean {
    return this.watchlist.some(item => item.id === auction.id);
  }

}
