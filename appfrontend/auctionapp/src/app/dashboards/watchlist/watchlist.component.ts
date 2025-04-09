import { Component, OnInit } from '@angular/core';

interface Auction {
  id: number;
  title: string;
  description: string;
  image: string;
  starting_price: number;
  current_price: number;
  end_time: string;
  seller_name: string;
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  
  watchlist: Auction[] = [];

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      this.watchlist = JSON.parse(storedWatchlist);
    }
  }

  removeFromWatchlist(auctionId: number): void {
    this.watchlist = this.watchlist.filter(auction => auction.id !== auctionId);
    localStorage.setItem("watchlist", JSON.stringify(this.watchlist));
  }
}

