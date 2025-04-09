import { Component,OnInit } from '@angular/core';
import { AdminservService } from 'src/app/adminserv.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users:any[]=[];

  constructor(private adminserv:AdminservService) { }

  ngOnInit(): void {
    this.loadusers();
  }


  loadusers(){
    this.adminserv.getallusers().subscribe((data:any)=>{
      this.users=data;
    });
  }
  togglestatus(id:number){
    this.adminserv.toggleuserstatus(id).subscribe(
      ()=>{
        this.loadusers();
      }
    )
  }
}

