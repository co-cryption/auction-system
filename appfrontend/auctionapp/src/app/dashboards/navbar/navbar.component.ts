import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 role: string='';

 constructor(private http:HttpClient, private route:Router ){
  this.role=localStorage.getItem('role') ||'';
 }
 onLogout(){

  const headers = new HttpHeaders({
    'Authorization': `Token ${localStorage.getItem('token')}`
  });

  this.http.post('http://127.0.0.1:8000/logoutuser',{},{headers}).subscribe(
    (res:any)=>{
      console.log(res);
      alert('logging out')
      localStorage.clear();
      this.route.navigate(['/auth/login'])
    },
    (error) => {
      console.error('Logout failed', error);
    }
  )
 }
}
