import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent} from './Components/login/login/login.component'
import { AuthenUserGuard } from './Components/Auth/authen-user.guard';


const routes: Routes = [
  {path:'', redirectTo: 'home', pathMatch: 'full'},
  {path:'login', component:LoginComponent},
  //{path:'home', component:HomeComponent },
  {path:'home', component:HomeComponent, canActivate:[AuthenUserGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
