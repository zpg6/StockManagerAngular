import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppData } from '../app-data';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-number-pad',
  templateUrl: './number-pad.component.html',
  styleUrls: ['./number-pad.component.css']
})
export class NumberPadComponent {

  appData: AppData;

  subscription = new Subscription();

  constructor(private messageService: MessageService, private router: Router, private http: HttpClient) {
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

  numbers = [
    [
      "1","2","3"
    ],
    [
      "4","5","6"
    ],
    [
      "7","8","9"
    ],
    [
      "X","0","E"
    ],
  ]

  hover = '';
  down = '';

  handleClick(num: string) {
    if (num === 'X') {
      this.appData.queryID = this.appData.queryID.substring(0,this.appData.queryID.length - 1);
    }
    else if (num === 'E') {
      if (this.appData.queryID.length > 0) {
        this.router.navigate(['search/id/'+this.appData.queryID]);
      }
    }
    else {
      if (this.appData?.queryID === '' || !(this.appData.queryID)) {
        this.appData.queryID = num
      }
      else {
        this.appData.queryID = this.appData.queryID + num;
      }
    }
    this.updateObserver()
  }

  mouseOver(button: string) {
    switch (button) {
      case "1":
        this.numbers[0][0] = button + "_w"
        break;
      case "2":
        this.numbers[0][1] = button + "_w"
        break;
      case "3":
        this.numbers[0][2] = button + "_w"
        break;
      case "4":
        this.numbers[1][0] = button + "_w"
        break;
      case "5":
        this.numbers[1][1] = button + "_w"
        break;
      case "6":
        this.numbers[1][2] = button + "_w"
        break;
      case "7":
        this.numbers[2][0] = button + "_w"
        break;
      case "8":
        this.numbers[2][1] = button + "_w"
        break;
      case "9":
        this.numbers[2][2] = button + "_w"
        break;
      case "X":
        this.numbers[3][0] = button + "_w"
        break;
      case "0":
        this.numbers[3][1] = button + "_w"
        break;
      case "E":
        this.numbers[3][2] = button + "_w"
        break;
    }
  }

  mouseLeave(button: string) {
    switch (button) {
      case "1_w":
        this.numbers[0][0] = "1"
        break;
      case "2_w":
        this.numbers[0][1] = "2"
        break;
      case "3_w":
        this.numbers[0][2] = "3"
        break;
      case "4_w":
        this.numbers[1][0] = "4"
        break;
      case "5_w":
        this.numbers[1][1] = "5"
        break;
      case "6_w":
        this.numbers[1][2] = "6"
        break;
      case "7_w":
        this.numbers[2][0] = "7"
        break;
      case "8_w":
        this.numbers[2][1] = "8"
        break;
      case "9_w":
        this.numbers[2][2] = "9"
        break;
      case "X_w":
        this.numbers[3][0] = "X"
        break;
      case "0_w":
        this.numbers[3][1] = "0"
        break;
      case "E_w":
        this.numbers[3][2] = "E"
        break;
    }
  }

  search() {
    this.router.navigate(['search/id/'+this.appData.queryID]);
  }

}
