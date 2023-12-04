import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent} from './Components/login/login/login.component'
import { AuthenUserGuard } from './Components/Auth/authen-user.guard';
import {HoldComponent} from './Components/hold/hold.component'
import { MachineDashboardComponent } from './Components/machine/machine-dashboard/machine-dashboard.component';
import { MachineAddComponent } from './Components/machine/machine-add/machine-add.component';
import { ProcessComponent } from './Components/process/process/process.component';
import { ProcessDashboardComponent } from './Components/process/process-dashboard/process-dashboard.component';


const routes: Routes = [
  {path:'', redirectTo: 'home', pathMatch: 'full'},
  {path:'login', component:LoginComponent},
  {path:'home', component:HomeComponent, canActivate:[AuthenUserGuard]},
  {path:'hold', component:HoldComponent, canActivate:[AuthenUserGuard]},
  {path:'machine-dashboard', component:MachineDashboardComponent, canActivate:[AuthenUserGuard]},
  {path:'machine-add', component:MachineAddComponent, canActivate:[AuthenUserGuard]},
  {path:'process-dashboard', component:ProcessDashboardComponent, canActivate:[AuthenUserGuard]},
  {path:'process-add', component:ProcessComponent, canActivate:[AuthenUserGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
