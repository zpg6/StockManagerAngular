import { User } from './user';

export class AppData {
  title: string = 'Stock Manager';
  apiRootURL: string = 'https://smapi.ngrok.io';

  user: User = new User();

  queryID = ''
  queryName = ''
  queryReadyID = false
  queryReadyName = false

  recentSearches = []
}
