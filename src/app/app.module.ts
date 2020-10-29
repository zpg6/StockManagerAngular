import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashComponent } from './dash/dash.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultsNameComponent } from './results-name/results-name.component';
import { SideNavComponent } from './side-nav/side-nav.component'
import { TasksComponent } from './tasks/tasks.component';
import { RouterModule } from '@angular/router';
import { ResultsIDComponent } from './results-id/results-id.component';
import { SearchIDComponent } from './search-id/search-id.component';
import { SearchNameComponent } from './search-name/search-name.component';
import { ItemCellComponent } from './item-cell/item-cell.component';
import { RecentSearchesComponent } from './recent-searches/recent-searches.component';
import { InviteCodesComponent } from './invite-codes/invite-codes.component';
import { NumberPadComponent } from './number-pad/number-pad.component';
import { SearchPageDescComponent } from './search-page-desc/search-page-desc.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashComponent,
    SearchIDComponent,
    SearchNameComponent,
    ResultsIDComponent,
    ResultsNameComponent,
    SideNavComponent,
    TasksComponent,
    ResultsIDComponent,
    SearchIDComponent,
    SearchNameComponent,
    ItemCellComponent,
    RecentSearchesComponent,
    InviteCodesComponent,
    NumberPadComponent,
    SearchPageDescComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
