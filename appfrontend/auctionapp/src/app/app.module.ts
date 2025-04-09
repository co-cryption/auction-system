import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SellerDashboardComponent } from './dashboards/seller-dashboard/seller-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { NavbarComponent } from './dashboards/navbar/navbar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
    MainLayoutComponent,
    SellerDashboardComponent,
    AdminDashboardComponent,
    NavbarComponent,
    AdminUsersComponent,
    AdminAuctionsComponent,
    SellerNewitemComponent,
    SellerActiveitemsComponent,
    BuyerDashboardComponent,
    BuyerAuctionsComponent,
    BuyerWatchlistComponent,
    BuyerAuctionDetailComponent,
    WatchlistComponent,
    SellerAllnotifComponent,
    BuyerCartComponent,
    AdminVuauctionsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
