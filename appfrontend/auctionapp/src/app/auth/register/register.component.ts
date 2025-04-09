import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  firstname:string ="";
  lastname:string ="";
  email:string ="";
  username:string ="";
  password:string ="";
  role:string="";

  constructor(private http:HttpClient){}
  
  onRegister(){
    let body={
      'firstname':this.firstname,
      'lastname':this.lastname,
      'email':this.email,
      'username':this.username,
      'password':this.password,
      'role':this.role
    }
    this.http.post('http://127.0.0.1:8000/registeruser',body).subscribe(
      (res:any)=>{
        console.log(res);
        alert('registration done')
      },
      (error)=>{
        console.error('registration failed',error)
        alert('registration failed')
      }
    )
  }

    
}
