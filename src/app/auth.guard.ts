import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router, private messageService: MessageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      var appData = this.messageService.getMessageOnce()

      if (next.routeConfig.path === 'search/id') {
        appData.queryReadyID = true;
        appData.queryReadyName = false;
      }
      else if (next.routeConfig.path === 'search/name') {
        appData.queryReadyID = false;
        appData.queryReadyName = true;
      }
      else {
        appData.queryReadyID = false;
        appData.queryReadyName = false;
      }
      this.messageService.sendMessage(appData)


      if (this.authService.authenticated) {
        return true
      }


      return new Promise<boolean>((res,rej) => {
        this.authService.authenticateFromCookies()
        .then(result => {
          if (result) {
            res(true)
          } else {
            this.router.navigate([''])
            res(false)
          }
        })
      })
  }

}
