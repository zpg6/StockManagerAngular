import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppData } from './app-data';
import { AuthenticationService } from './authentication.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.appData.queryReadyID) {
      console.log('KEY PRESSED!!! - ' + event.key)
      if (event.key === 'Enter') {
        if (this.appData.queryID.length > 0) {
          this.router.navigate(['search/id/'+this.appData.queryID])
        }
      }
      else if (event.key === 'Backspace' || event.key === 'Delete') {
        this.appData.queryID = this.appData.queryID.substring(0,this.appData.queryID.length - 1);
      }
      else if (event.key.length == 1 && !isNaN(+event.key)){
        this.appData.queryID = this.appData.queryID + event.key;
      }
      this.updateObserver();
    }
    if (this.appData.queryReadyName) {
      console.log('KEY PRESSED!!! - ' + event.key)
      if (event.key === 'Enter') {
        if (this.appData.queryName.length > 0) {
          this.router.navigate(['search/name/'+this.appData.queryName])
        }
      }
      else if (event.key === 'Backspace' || event.key === 'Delete') {
        this.appData.queryName = this.appData.queryName.substring(0,this.appData.queryName.length - 1);
      }
      else if (event.key.length == 1){
        this.appData.queryName = this.appData.queryName + event.key;
      }
      this.updateObserver();
    }
  }


  authenticated;
  appData: AppData;
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

  isAuthenticated(): boolean {
    return this.authService.authenticated;
  }
}
