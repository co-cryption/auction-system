// import { Component, OnInit } from '@angular/core';
// import { FormBuilder,FormGroup,Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// @Component({
//   selector: 'app-seller-newitem',
//   templateUrl: './seller-newitem.component.html',
//   styleUrls: ['./seller-newitem.component.css']
// })
// export class SellerNewitemComponent  implements OnInit{

//   newItemForm!:FormGroup;
//   imagePreview:string |null=null;
//   imageFile: File | null = null;

//   constructor(private fb: FormBuilder,private http:HttpClient){}

//   ngOnInit(): void {
//     this.newItemForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       startingPrice: ['', [Validators.required, Validators.min(0.01)]],
//       endTime: ['', Validators.required]
//     });

//     const now = new Date();
//     now.setHours(now.getHours() + 1);

//     this.newItemForm.get('endTime')?.setValue(now.toISOString().slice(0, 16));
//   }

//   get title() { return this.newItemForm.get('title'); }
//   get description() { return this.newItemForm.get('description'); }
//   get startingPrice() { return this.newItemForm.get('startingPrice'); }
//   get endTime() { return this.newItemForm.get('endTime'); }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file && file.type.match(/image\/*/) !== null) {
//       this.imageFile = file;
      
//       // Create image preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result as string;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   removeImage(): void {
//     this.imageFile = null;
//     this.imagePreview = null;
//   }

//   onSubmit(): void {
//     if (this.newItemForm.valid && this.imageFile) {
//       // Create FormData object to send to Django REST API
//       const formData = new FormData();
//       formData.append('title', this.title!.value);
//       formData.append('description', this.description!.value);
//       formData.append('starting_price', this.startingPrice!.value);
//       formData.append('end_time', this.endTime!.value);
//       formData.append('image', this.imageFile);

//       // Send to Django REST API
//       this.http.post('http://your-django-api/api/auction-items/', formData)
//         .subscribe(
//           (response) => {
//             console.log('Item created successfully', response);
//             this.newItemForm.reset();
//             this.removeImage();
//             // Add success message or redirect
//           },
//           (error) => {
//             console.error('Error creating item', error);
//             // Handle errors
//           }
//         );
//     }
//   }

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-seller-newitem',
  templateUrl: './seller-newitem.component.html',
  styleUrls: ['./seller-newitem.component.css']
})
export class SellerNewitemComponent implements OnInit {
  newItemForm!: FormGroup; // Ensures TypeScript knows this will be initialized
  imagePreview: string | null = null;
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.newItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startingPrice: ['', [Validators.required, Validators.min(0.01)]],
      endTime: ['', Validators.required]  // Fixed: This field must exist in the form
    });

    // Set default end time to 1 hour from now
    const now = new Date();
    now.setHours(now.getHours() + 1);
    
    this.newItemForm.get('endTime')?.setValue(now.toISOString().slice(0, 16)); // Fix: Using optional chaining
  }

  get title() { return this.newItemForm.get('title')!; }
  get description() { return this.newItemForm.get('description')!; }
  get startingPrice() { return this.newItemForm.get('startingPrice')!; }
  get endTime() { return this.newItemForm.get('endTime')!; }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.match(/image\/*/) !== null) {
      this.imageFile = file;

      // Create an image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.newItemForm.valid && this.imageFile) {
      const formData = new FormData();
      formData.append('title', this.title.value);
      formData.append('description', this.description.value);
      formData.append('starting_price', this.startingPrice.value);
      formData.append('end_time', this.endTime.value);
      formData.append('image', this.imageFile);
      const token=localStorage.getItem('token')
      const role1=localStorage.getItem('role') || '';

      const headers=new HttpHeaders({'Authorization':`Token ${token}`,'Active-role':role1})

      this.http.post('http://127.0.0.1:8000/itemlisting', formData,{headers})
        .subscribe(
          (response) => {
            console.log('Item created successfully', response);
            this.newItemForm.reset();
            this.removeImage();
          },
          (error) => {
            console.error('Error creating item', error);
          }
        );
    }
  }
}

