import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { AdminservService } from 'src/app/adminserv.service';
@Component({
  selector: 'app-admin-auctions',
  templateUrl: './admin-auctions.component.html',
  styleUrls: ['./admin-auctions.component.css']
})
export class AdminAuctionsComponent implements OnInit {
  auction:any[]=[];
  constructor(private adminserv:AdminservService){}

  ngOnInit(): void {
    this.loadauctions();
  }


  loadauctions(){
    this.adminserv.getauctions().subscribe((data:any)=>{
      this.auction=data;
    })
  }

  toggleaucstatus(id:number){
    this.adminserv.toggleauctionstatus(id).subscribe(
      (response:any)=>{
        console.log(response.message)
        this.loadauctions();
      }
    )
  }
}
