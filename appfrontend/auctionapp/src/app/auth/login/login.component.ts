import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username:string ="";
  password:string ="";
  role:string="";

  constructor(private http : HttpClient,private router:Router){  }

  onLogin(){
    let body: any={
      'username':this.username,
      'password':this.password,
    }
    if (this.role && this.role !== 'admin') {
      body['role'] = this.role;
    }
    this.http.post('http://127.0.0.1:8000/loginuser',body).subscribe(
      (res:any)=>{
        console.log('this is res',res);
        localStorage.setItem('token',res.token);
        localStorage.setItem('username',res.username);
        localStorage.setItem('role',res.active_role);
        console.log("Stored Username::", localStorage.getItem('username'));
        alert('login done')
        if(res.active_role ==='seller')
        {
          this.router.navigate(['/main/sellerdash']);
          alert('seller login')
        }else if(res.active_role ==='admin'){
          this.router.navigate(['/main/admindash']);
          alert('Admin login')
        }else if(res.active_role ==='buyer'){
          this.router.navigate(['/main/buyerdash']);
          alert('Buyer login')
        }

      },
      (error)=>{
        console.error('login failed',error)
        alert('invalid credentials')
      }
    )
  }
}
