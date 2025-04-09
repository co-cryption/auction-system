import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SellerDashboardComponent } from './dashboards/seller-dashboard/seller-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './dashboards/admin-users/admin-users.component';
import { AdminAuctionsComponent } from './dashboards/admin-auctions/admin-auctions.component';
import { SellerNewitemComponent } from './dashboards/seller-newitem/seller-newitem.component';
import { SellerActiveitemsComponent } from './dashboards/seller-activeitems/seller-activeitems.component';
import { BuyerDashboardComponent } from './dashboards/buyer-dashboard/buyer-dashboard.component';
import { BuyerAuctionsComponent } from './dashboards/buyer-auctions/buyer-auctions.component';
import { BuyerWatchlistComponent } from './dashboards/buyer-watchlist/buyer-watchlist.component';
import { BuyerAuctionDetailComponent } from './dashboards/buyer-auction-detail/buyer-auction-detail.component';
import { WatchlistComponent } from './dashboards/watchlist/watchlist.component';
import { SellerAllnotifComponent } from './dashboards/seller-allnotif/seller-allnotif.component';
import { BuyerCartComponent } from './dashboards/buyer-cart/buyer-cart.component';
import { AdminVuauctionsComponent } from './dashboards/admin-vuauctions/admin-vuauctions.component';
const routes: Routes = [
  {
    path:'auth',
    component: AuthLayoutComponent,
    children:[
              {path:'login',component:LoginComponent},
              {path:'register',component:RegisterComponent}
            ]
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    children: [
      { path: 'sellerdash', component: SellerDashboardComponent,
        children:[
          {path:'newlisting',component:SellerNewitemComponent},
          {path:'activlisting',component:SellerActiveitemsComponent},
          {path:'allnotif',component:SellerAllnotifComponent},
          { path: '', redirectTo: 'seller-newlisting', pathMatch: 'full' }
        ]
    },
      {
        path: 'admindash', 
        component: AdminDashboardComponent,
        children: [
          { path: 'users', component: AdminUsersComponent },
          { path: 'auctions', component: AdminAuctionsComponent },
          { path: 'allauctions', component: AdminVuauctionsComponent },
          { path: '', redirectTo: 'admin-users', pathMatch: 'full' }
        ]
      },
      { path: 'buyerdash', component: BuyerDashboardComponent,
        children:[
          {path:'buyeritems',component:BuyerAuctionsComponent},
          {path:'buyerwatchlist',component:BuyerWatchlistComponent},
          {path:'auction-detail/:id',component:BuyerAuctionDetailComponent},
          {path:'watchlist',component:WatchlistComponent},
          {path:'cart',component:BuyerCartComponent},
          { path: '', redirectTo: 'buyer-buyeritems', pathMatch: 'full' }
        ]
    }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
