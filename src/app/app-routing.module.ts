import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './dash/dash.component';
import { HomeComponent } from './home/home.component';
import { ResultsNameComponent } from './results-name/results-name.component';
import { TasksComponent } from './tasks/tasks.component';
import { AuthGuard } from './auth.guard';
import { SearchIDComponent } from './search-id/search-id.component';
import { SearchNameComponent } from './search-name/search-name.component';
import { ResultsIDComponent } from './results-id/results-id.component';
import { RecentSearchesComponent } from './recent-searches/recent-searches.component';
import { InviteCodesComponent } from './invite-codes/invite-codes.component';
import { QuantitiesComponent } from './quantities/quantities.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: SearchIDComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search/id/:id',
    component: ResultsIDComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search/name/:name',
    component: ResultsNameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invite',
    component: InviteCodesComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
