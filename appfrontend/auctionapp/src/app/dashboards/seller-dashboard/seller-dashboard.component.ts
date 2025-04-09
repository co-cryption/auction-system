import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  username: string = "";
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || "";
    console.log("Stored Username:", localStorage.getItem('username'));
  }
 
}
