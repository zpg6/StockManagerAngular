import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppData } from './app-data';
import { MessageService } from './message.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private cookies: CookieService, private messageService: MessageService) {

  }

  authenticated = false;

  async authenticateFromCookies(): Promise<boolean> {

    const email = this.cookies.get('email')
    const password = this.cookies.get('password')

    if (email.length > 0 && password.length > 0) {

      const body= new User();
      body.email = email.toLowerCase();
      body.password = password;
      const url = this.messageService.getMessageOnce().apiRootURL + '/user/authenticate'

      return new Promise<boolean>((res,rej)=>{
        this.http.post<User>(url, body).toPromise().then((response) => {
          console.log('response.userID = ' + response.userID);
          if (response != null && response.userID != null && response.userID.length > 0) {
            var currentAppData = this.messageService.getMessageOnce()
            currentAppData.user = response;
            this.messageService.sendMessage(currentAppData);
            this.login();
            res(true)
          }
          res(false)
        })
      })

    }

    return new Promise<boolean>((res,rej)=>{res(false)})
  }

  login() {
    this.authenticated = true
  }

  logout() {
    this.cookies.deleteAll()
    this.authenticated = false
  }

}
