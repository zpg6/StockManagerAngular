import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppData } from '../app-data';
import { AuthenticationService } from '../authentication.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  appData: AppData;
  loading = false;
  disabled = false;
  subscription = new Subscription();

  constructor(private messageService: MessageService, private authService: AuthenticationService, private router: Router) {
      // subscribe to home component messages
      this.subscription = new Subscription()
      this.subscription.add(this.messageService.getMessage().subscribe(message => {
        this.appData = message;
        console.log('Subscription updated @ HomepageContainerComponent')
      }));
      console.log('Subscription created @ HomepageContainerComponent')
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  updateObserver() {
    //update all observers that data has changed
    this.messageService.sendMessage(this.appData);
  }

  ngOnInit(): void {
  }

  isAdmin(): boolean {
    return this.appData?.user?.userRole === 'Admin';
  }

  logout() {
    this.loading = true;
    this.disabled = true;
    this.authService.logout();
    this.router.navigate([''])
  }
}
