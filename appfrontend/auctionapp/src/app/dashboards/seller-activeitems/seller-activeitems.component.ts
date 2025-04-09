// import { Component, OnInit } from '@angular/core';
// import { HttpClient,HttpHeaders } from '@angular/common/http';
// interface AuctionItem {
//   id: number;
//   title: string;
//   description: string;
//   starting_price: number;
//   current_price: number;
//   buyer_username: string | null;
//   image: string;
//   end_time: string;

// }
// @Component({
//   selector: 'app-seller-activeitems',
//   templateUrl: './seller-activeitems.component.html',
//   styleUrls: ['./seller-activeitems.component.css']
// })
// export class SellerActiveitemsComponent  implements OnInit{

//   auctionItems:AuctionItem[]=[];
//   constructor(private http: HttpClient){}

//   ngOnInit(): void {
//     this.fetchAuctionItems();
//   }
//   fetchAuctionItems(): void {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('role') || '';

//     const headers = new HttpHeaders({ 'Authorization': `Token ${token}`, 'Active-role': role });

//     this.http.get<AuctionItem[]>('http://127.0.0.1:8000/getAuctionItems', { headers })
//       .subscribe(
//         (response) => {
//           this.auctionItems = response;
//         },
//         (error) => {
//           console.error('Error fetching auction items', error);
//         }
//       );
//   }
 
  

// }

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DatePipe } from '@angular/common';
interface AuctionItem {
  id: number;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  buyer_username: string | null;
  image: string;
  end_time: string;
}

@Component({
  selector: 'app-seller-activeitems',
  templateUrl: './seller-activeitems.component.html',
  styleUrls: ['./seller-activeitems.component.css']
})
export class SellerActiveitemsComponent implements OnInit {
  auctionItems: AuctionItem[] = [];
  newItemForm!: FormGroup;  // Form for editing auction item
  imagePreview: string | null = null;
  selectedItemId: number | null = null;
  imageFile: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchAuctionItems();

    //  Initialize the form
    this.newItemForm = this.fb.group({
      title: [''],
      description: [''],
      starting_price: [''],
      end_time: [''],
      image: [null]
    });
  }

  fetchAuctionItems(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || '';

    const headers = new HttpHeaders({ 'Authorization': `Token ${token}`, 'Active-role': role });

    this.http.get<AuctionItem[]>('http://127.0.0.1:8000/getitemseller', { headers })
      .subscribe(
        (response) => {
          this.auctionItems = response;
        },
        (error) => {
          console.error('Error fetching auction items', error);
        }
      );
  }

  editAuctionItem(item: AuctionItem): void {
    this.newItemForm.patchValue({
      title: item.title,
      description: item.description,
      starting_price: item.starting_price,
      end_time: item.end_time
    });
    this.imagePreview = item.image;
    this.selectedItemId = item.id;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.newItemForm.valid) {
      const formData = new FormData();
      formData.append('title', this.newItemForm.value.title);
      formData.append('description', this.newItemForm.value.description);
      formData.append('starting_price', this.newItemForm.value.starting_price);
      formData.append('end_time', this.newItemForm.value.end_time);

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });

      if (this.selectedItemId) {
        
        this.http.put(`http://127.0.0.1:8000/editaucitem/${this.selectedItemId}`, formData, { headers })
          .subscribe(response => {
            console.log('Item updated successfully', response);
            this.resetForm();
            this.fetchAuctionItems();  // Reload items
          });
      }
    }
  }

  deleteAuctionItem(itemId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });

    this.http.delete(`http://127.0.0.1:8000/deleteItem/${itemId}`, { headers })
      .subscribe(response => {
        console.log('Item deleted successfully', response);
        this.fetchAuctionItems();
      });
  }

  resetForm(): void {
    this.newItemForm.reset();
    this.imagePreview = null;
    this.imageFile = null;
    this.selectedItemId = null;
  }
  isExpired(endTime: string): boolean {
    return new Date(endTime).getTime() < new Date().getTime();
  }
}
