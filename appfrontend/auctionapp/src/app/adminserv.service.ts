import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdminservService {
 


  constructor(private http:HttpClient) { }

  getallusers(){
    const token=localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Token ${token}`)
    return this.http.get('http://127.0.0.1:8000/getuser',{headers});
  }

  toggleuserstatus(id:number){
    const token=localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Token ${token}`)
    return this.http.post('http://127.0.0.1:8000/approveuser',{id},{headers});

  }
  getauctions(){
    const token=localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Token ${token}`)
    return this.http.get('http://127.0.0.1:8000/getAuctionItems',{headers});
  }
  toggleauctionstatus(id:number){
    const token=localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Token ${token}`)
    return this.http.post(`http://127.0.0.1:8000/itemapprove/${id}`,{},{headers});
  }

}
