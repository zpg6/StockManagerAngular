export class User {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  invitationCode: string = '';
  password: string = '';
  userID: string = '';
  storeID: string = '';
  companyID: string = '';
  userRole: string = 'Admin';
  ipAddresses: Array<string> = [];
  userLastLogin: Date = null;
}
