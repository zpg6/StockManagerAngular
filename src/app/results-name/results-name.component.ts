import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppData } from '../app-data';
import { ItemModel } from '../item-model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-results-name',
  templateUrl: './results-name.component.html',
  styleUrls: ['./results-name.component.css']
})
export class ResultsNameComponent {

  appData: AppData;
  results: ItemModel[];
  error = '';
  subscription = new Subscription();

  constructor(private messageService: MessageService, private ar: ActivatedRoute, private http: HttpClient) {
      // subscribe to home component messages
      this.subscription = new Subscription()
      this.subscription.add(this.messageService.getMessage().subscribe(message => {
        this.appData = message;
        this.ar.paramMap.subscribe(params => {
          this.search(params.get('name'))
          let route = 'search/name/'+params.get('name')
          if (!this.appData.recentSearches.includes(route)) {
            this.appData.recentSearches.push(route)
          }
        })
        console.log('Subscription updated @ ResultsNameComponent')
      }));
      console.log('Subscription created @ ResultsNameComponent')
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  updateObserver() {
    //update all observers that data has changed
    this.messageService.sendMessage(this.appData);
  }


  search(name: string) {
    var body = {};
    body['name'] = name;
    body['storeID'] = this.appData.user.storeID;
    const url = this.appData.apiRootURL + '/item/query/name'
    this.http.post<ItemModel[]>(url, body).toPromise().then((response) => {
      console.log('response' + response);
      if (response != null) {
        this.results = response;

        this.results.forEach(returnedItem => {
          const imgBody = new Object();
          imgBody['id'] = returnedItem.id;
          const imgURL = this.appData.apiRootURL + '/item/imageurl'
          this.http.post<any>(imgURL, imgBody).toPromise().then((imgResponse) => {
            this.results.forEach(item => {
              if (item.id === returnedItem.id) {
                console.log(imgResponse.imageURL);
                item.imageURL = imgResponse.imageURL;
              }
            })
          }).catch(err => {
            console.error(err);
          })
        })

      } else {
        console.log('response from API was null for query.');
      }
    }).catch(err => {
      console.log(err);
      this.setNotification(err.error.text);
    })
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

}
