import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppData } from '../app-data';
import { MessageService } from '../message.service';
import { ItemModel } from '../item-model';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search-id',
  templateUrl: './search-id.component.html',
  styleUrls: ['./search-id.component.css']
})
export class SearchIDComponent implements OnInit {

  appData: AppData;
  results: ItemModel[];
  error = '';
  subscription = new Subscription();
  showTip = true;

  @ViewChild('idField') idField: ElementRef;
  @ViewChild('nameField') nameField: ElementRef;

  constructor(private messageService: MessageService, private router: Router) {
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

  searchID() {
    this.appData.queryID = this.idField.nativeElement.value
    if (this.appData.queryID.length > 0) {
      this.router.navigate(['search/id/'+this.appData.queryID]);
    }
    this.updateObserver()
  }

  searchName() {
    this.appData.queryName = this.nameField.nativeElement.value
    if (this.appData.queryName.length > 0) {
      this.router.navigate(['search/name/'+this.appData.queryName]);
    }
    this.updateObserver()
  }

  //set the notification
  setNotification(to: string) {
    this.error = to;
  }
  //remove the notification string
  hideNotification() {
    this.error = '';
  }

  //check if there is a notification that needs to be shown
  showNotification(): boolean {
    return this.error !== ''
  }

  nav(to: string) {
    this.router.navigate([to]);
  }

}
