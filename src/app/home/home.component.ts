import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';
import { AppData } from '../app-data';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';
import { CookieService } from 'ngx-cookie-service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //declare variables
  appData: AppData;
  subscription = new Subscription();
  tab = 'Login'

  //Declare the children of the view
  @ViewChild('modal') modal: ElementRef;

  @ViewChild('loginTab') loginTab: ElementRef;
  @ViewChild('createAnAccountTab') createAnAccountTab: ElementRef;

  @ViewChild('invitationCodeField') invitationCodeField: ElementRef;
  @ViewChild('firstNameField') firstNameField: ElementRef;
  @ViewChild('lastNameField') lastNameField: ElementRef;
  @ViewChild('emailField') emailField: ElementRef;
  @ViewChild('passwordField') passwordField: ElementRef;
  @ViewChild('confirmPasswordField') confirmPasswordField: ElementRef;

  invitationCodeError = null;
  firstNameError = null;
  lastNameError = null;
  emailError = null;
  passwordError = null;
  confirmPasswordError = null;

  notificationContent: string = '';

  disabled = false;

  loading = false;

  //set the notification
  setNotification(to: string) {
    this.notificationContent = to
  }
  //remove the notification string
  hideNotification() {
    this.notificationContent = ''
  }
  //check if there is a notification that needs to be shown
  showNotification(): boolean {
    return this.notificationContent !== ''
  }

  constructor(private messageService: MessageService, private http: HttpClient, private router: Router, private authService: AuthenticationService, private cookies: CookieService) {
      // subscribe to home component messages
      this.authService.authenticateFromCookies()
        .then(result => {
          if (result) {
            this.router.navigate(['search'])
          } else {
            this.subscription = new Subscription()
            this.subscription.add(this.messageService.getMessage().subscribe(message => {
              this.appData = message;
              console.log('Subscription updated @ ModalComponent')
            }));
            console.log('Subscription created @ ModalComponent')
          }
        })


  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  updateObserver() {
    //update all observers that data has changed
    this.messageService.sendMessage(this.appData);
  }

  ngOnInit() {
    //update shared data of observable and instantiate login button
    this.appData = this.messageService.getMessageOnce()
  }

  //toggle between 'Login' and 'Create an Account' tabs in modal
  toggleTab(from: string) {
    //Don't want to toggle when clicking on thab that is open
    if (from === this.tab) { return }
    //toggle to the other tab
    this.tab = (this.tab === 'Login') ? 'Create an Account':'Login'
    this.loginTab.nativeElement.classList.toggle('is-active')
    this.createAnAccountTab.nativeElement.classList.toggle('is-active')
    this.firstNameError = null
    this.lastNameError = null
    this.emailError = null
    this.invitationCodeError = null
    this.confirmPasswordError = null
    this.passwordError = null
  }

  //log the user in on success
  loginUser() {
    if (this.findErrors() == 0) {
      // perform login

    }
  }

  findErrors(): number {
    var count = 0;




    return count
  }

  validateEmail(val: string): string{
    var resultingString = ''
    val = val.toLowerCase()

    if(val.length === 0){
      return 'Email cannot be blank'
    }

    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const found = val.match(regex);

    if(found === null){
      return 'Invalid email format'
    }

    return resultingString
  }

  validateStrongPassword(val: string): string{
    var resultingString = ''

    var lowercaseRegex = new RegExp('^(?=.*[a-z])');
    var uppercaseRegex = new RegExp('^(?=.*[A-Z])');
    var numberRegex = new RegExp('(?=.*[0-9])');
    var specialCharRegex = new RegExp('(?=.*[!@#\$%\^&\*])')
    var eightCharMinRegex = new RegExp('(?=.{8,})')

    if (!lowercaseRegex.test(val)){
      resultingString = resultingString + 'at least one lowercase letter,\n'
    }
    if (!uppercaseRegex.test(val)){
      resultingString = resultingString + 'at least one uppercase letter,\n'
    }
    if (!numberRegex.test(val)){
      resultingString = resultingString + 'at least one number,\n'
    }
    if (!specialCharRegex.test(val)){
      resultingString = resultingString + 'at least special character,\n'
    }
    if (!eightCharMinRegex.test(val)){
      resultingString = resultingString + 'at least 8 characters,\n'
    }

    if(resultingString.length != 0) {
      resultingString = 'Password must contain:\n' + resultingString
      resultingString = resultingString.substring(0, resultingString.length-2)
    }

    return resultingString
  }

  validateInvitationCode(val: string): string {
      var resultingString = ''

      if(val.length === 0){
          resultingString = 'Please enter an invitation code.'
      }

      return resultingString
  }

  confirmPassword(first: string, second: string): string {
    var resultingString = ''

    if(first.length === 0) {
      return 'Cannot be empty.'
    }


    if(first !== second){
      resultingString = 'Passwords do not match.'
    }

    return resultingString
  }

  sanitizeName(name: string): string {
    var resultingName = name

    if (resultingName.length !== 0) {
      resultingName = resultingName.trim()

      resultingName = resultingName[0].toUpperCase() + resultingName.slice(1);

      var i = 0;
      while(i < resultingName.length - 1) {
        if(resultingName[i] === ' ' || resultingName[i] === '-' || resultingName[i] === "'"){
          var charToBeUppercased = resultingName[i+1]
          resultingName = resultingName.substring(0, i+1) + charToBeUppercased.toUpperCase() + resultingName.substring(i+2, resultingName.length)
        }
        i++
      }

    }

    return resultingName
  }

  validateFields(): Boolean {

    var result = true

    this.emailError = this.validateEmail(this.emailField.nativeElement.value)
    if (this.emailError.length != 0){
      result = false
    }

    if (this.tab === 'Create an Account'){
      this.passwordError = this.validateStrongPassword(this.passwordField.nativeElement.value)
      if (this.passwordError.length != 0){
        result = false
      }
    } else {
      if (this.passwordField.nativeElement.value.length === 0){
        this.passwordError = 'Password cannot be empty.'
      } else {
        this.passwordError = ''
      }
    }

    if (this.tab === 'Create an Account'){
      this.confirmPasswordError = this.confirmPassword(this.confirmPasswordField.nativeElement.value, this.passwordField.nativeElement.value)
      if (this.confirmPasswordError != 0) {
        result = false
      }
    }

    if (this.tab === 'Create an Account') {
      this.invitationCodeError = this.validateInvitationCode(this.invitationCodeField.nativeElement.value)
      if (this.invitationCodeError.length != 0){
        result = false
      }
    }

    if (this.tab === 'Create an Account') {
      this.firstNameField.nativeElement.value = this.sanitizeName(this.firstNameField.nativeElement.value)
      if(this.firstNameField.nativeElement.value.length === 0) {
        this.firstNameError = 'First name cannot be empty.'
        result = false
      } else {
        this.firstNameError = ''
      }
    }

    if (this.tab === 'Create an Account') {
      this.lastNameField.nativeElement.value = this.sanitizeName(this.lastNameField.nativeElement.value)
      if(this.lastNameField.nativeElement.value.length === 0) {
        this.lastNameError = 'Last name cannot be empty.'
        result = false
      } else {
        this.lastNameError = ''
      }
    }

    return result
  }

  getFieldClass(error: String){

    if (error === null){
      return 'is-dark has-text-dark'
    } else if (error === ''){
      return 'is-primary has-text-primary'
    } else {
      return 'is-danger has-text-danger'
    }
  }

  getFieldIcon(error: String){

    if (error === null){
      return ''
    } else if (error === ''){
      return 'mdi mdi-24px mdi-check-circle'
    } else {
      return 'mdi mdi-24px mdi-alert-circle'
    }
  }

  loginButtonClicked(){
    if(this.validateFields()){
      this.login(this.emailField.nativeElement.value, this.passwordField.nativeElement.value)
      //this.updateObserver()
    }
  }

  createAccountButtonClicked(){
    if(this.validateFields()){
      let invitationCode = this.invitationCodeField.nativeElement.value
      let firstName = this.firstNameField.nativeElement.value
      let lastName = this.lastNameField.nativeElement.value
      let email = this.emailField.nativeElement.value
      let password = this.passwordField.nativeElement.value
      this.createAccount(invitationCode,firstName,lastName,email,password);
    }
  }

  login(email: string, password: string) {
    this.disabled = true;
    this.loading = true;
    const body= new User();
    body.email = email.toLowerCase();
    body.password = password;
    const url = this.appData.apiRootURL + '/user/authenticate'
    this.http.post<User>(url, body).toPromise().then((response) => {
      console.log('response.userID = ' + response.userID);
      if (response != null && response.userID != null && response.userID.length > 0) {
        console.log('response.userID = ' + response.userID);
        this.appData.user = response;
        this.authService.login();
        this.cookies.set('email', response.email)
        this.cookies.set('password', password)
        this.updateObserver();
        this.router.navigate(['search'])
      } else {
        console.log('response could not be processed');
      }
      this.disabled = false;
      this.loading = false;
    }).catch(err => {
      console.log(err);
      this.notificationContent = err.error.text;
      this.disabled = false;
      this.loading = false;
    })
  }

  createAccount(invitationCode: string, firstName: string, lastName: string, email: string, password: string) {
    this.disabled = true;
    this.loading = true;
    const body= new User();
    body.invitationCode = invitationCode;
    body.firstName = firstName;
    body.lastName = lastName;
    body.email = email.toLowerCase();
    body.password = password;
    const url = this.appData.apiRootURL + '/user/create'
    this.http.post<User>(url, body).toPromise().then((response) => {
      console.log('response.userID = ' + response.userID);
      if (response != null && response.userID != null && response.userID.length > 0) {
        console.log('response.userID = ' + response.userID);
        this.appData.user = response;
        this.cookies.set('email', response.email)
        this.cookies.set('password', password)
        this.authService.login();
        this.updateObserver();
        this.router.navigate(['search'])
      } else {
        console.log('response could not be processed');
      }
      this.disabled = false;
      this.loading = false;
    }).catch(err => {
      console.log(err);
      this.notificationContent = err.error.text;
      this.disabled = false;
      this.loading = false;
    })
  }

  options: AnimationOptions = {
    path: 'assets/images/forklift-lottie.json',

  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
