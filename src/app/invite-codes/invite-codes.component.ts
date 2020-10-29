import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-invite-codes',
  templateUrl: './invite-codes.component.html',
  styleUrls: ['./invite-codes.component.css']
})
export class InviteCodesComponent implements OnInit {

  successMsg = ''
  errorMsg = ''

  codes: any[] = []

  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    let appData = this.messageService.getMessageOnce()
    var body = {
      storeID: appData.user.storeID
    }
    let url = appData.apiRootURL + '/codes/get-all-valid'

    this.http.post<any[]>(url, body)
    .toPromise()
    .then(result => {
      console.log(result)
      this.codes = result
    })
    .catch(err =>{
      console.error(err)
      this.errorMsg = err.error.text
    })
  }

  generateCode() {

    let appData = this.messageService.getMessageOnce()
    var body = {
      storeID: appData.user.storeID,
      companyID: appData.user.companyID
    }
    let url = appData.apiRootURL + '/invitation-code/generate'

    this.http.post<any>(url, body)
    .toPromise()
    .then(result => {
      console.log(result)
      this.codes.push(result)
      this.successMsg = `✅ Invitation Code ${result.code} Added`
    })
    .catch(err =>{
      console.error(err)
      this.errorMsg = err.error.text
    })

  }

  revokeCode(code: string) {

    let appData = this.messageService.getMessageOnce()
    var body = {
      storeID: appData.user.storeID,
      companyID: appData.user.companyID,
      code: code
    }
    let url = appData.apiRootURL + '/invitation-code/revoke'

    this.http.post<any>(url, body)
    .toPromise()
    .then(result => {
      console.log(result)
      this.codes = this.codes.filter(invCode => {
        return invCode.code !== code
      })
      this.successMsg = `✅ Invitation Code ${result.code} Revoked`
    })
    .catch(err =>{
      console.error(err)
      this.errorMsg = err.error.text
    })

  }

}
