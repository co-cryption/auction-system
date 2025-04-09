import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';


interface Allitems {
  id:number;
  title:string;
  end_time:string;
  status:string;
  buyer?:string;
  final_price?:number;
  payment_status:string;

}
@Component({
  selector: 'app-admin-vuauctions',
  templateUrl: './admin-vuauctions.component.html',
  styleUrls: ['./admin-vuauctions.component.css']
})
export class AdminVuauctionsComponent implements OnInit {
  allitems:Allitems[]=[];

  constructor(private http: HttpClient) { }
   ngOnInit(): void {
     this.fetchallauctions()
   }

   fetchallauctions():void{

    const token=localStorage.getItem('token')
    const headers= new HttpHeaders({'Authorization':`Token ${token}`})

    this.http.get<Allitems[]>('http://127.0.0.1:8000/getallAuctionItems',{headers}).subscribe(
      (response)=>{
        this.allitems=response;
      },
      (error)=>{
        console.error('Error fetching auctions',error)
      }
    );
   }
}
