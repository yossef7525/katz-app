import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeoplesComponent } from './pages/peoples/peoples.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DistributesComponent } from './pages/distributes/distributes.component';
import { SortedComponent } from './pages/sorted/sorted.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { CommentsComponent } from './pages/comments/comments.component';

const routes: Routes = [
  {path: '', redirectTo: '/peoples', pathMatch: 'full'},
  {path: 'peoples', component:PeoplesComponent, canActivate:[AuthGuard]},
  {path: 'deliveries', component:DeliveriesComponent, canActivate:[AuthGuard]},
  {path: 'distributes', component:DistributesComponent, canActivate:[AuthGuard]},
  {path: 'sorted', component:SortedComponent, canActivate:[AuthGuard]},
  {path: 'comments', component:CommentsComponent, canActivate:[AuthGuard]},
  { path: 'login-page', component: LoginComponent },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
