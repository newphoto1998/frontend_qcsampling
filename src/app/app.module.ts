import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Template/header/header.component';
import { FooterComponent } from './Template/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'
/*import { MatTableModule } from '@angular/material/table';*/
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenService} from 'src/app/Middleware/Services/authen.service'

// import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, 
//   MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,MatCardModule,
//   MatSlideToggleModule,MatIconModule } from '@angular/material';

  import { MatAutocompleteModule} from '@angular/material/autocomplete';
  import { MatButtonModule} from '@angular/material/button'
  import { MatCheckboxModule} from '@angular/material/checkbox'
  import { MatFormFieldModule } from '@angular/material/form-field'
  import { MatInputModule } from '@angular/material/input'
  import { MatSelectModule } from '@angular/material/select'
  import { MatCardModule } from '@angular/material/card'
  import { MatIconModule } from '@angular/material/icon'
//  import { MatDatepickerModule,MatNativeDateModule } from '@angular/material/datepicker'
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './Components/login/login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { MatMenuModule } from '@angular/material/menu';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { AuthenUserGuard } from 'src/app/Components/Auth/authen-user.guard';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSidenavModule } from '@angular/material/sidenav'
import { HideKeyboardModule } from 'hide-keyboard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatListModule} from '@angular/material/list';
import { HoldComponent } from './Components/hold/hold.component'
import { MatTableModule } from '@angular/material/table';
import { MachineDashboardComponent } from './Components/machine/machine-dashboard/machine-dashboard.component';
import { MachineAddComponent } from './Components/machine/machine-add/machine-add.component';
import { ProcessComponent } from './Components/process/process/process.component';
import { ProcessDashboardComponent } from './Components/process/process-dashboard/process-dashboard.component';

@NgModule({
  declarations: [

    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    HoldComponent,
    MachineDashboardComponent,
    MachineAddComponent,
    ProcessComponent,
    ProcessDashboardComponent
  ],
  imports: [
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    HideKeyboardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatPaginatorModule,
    HttpClientModule,
    MatGridListModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule, 
    MatCheckboxModule, 
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    //MatRadioModule, 
    MatSelectModule, 
    //MatSliderModule,
    //MatSlideToggleModule,
    MatNativeDateModule,
    MatIconModule ,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgbModule
  ],
  providers: [MatIconModule,CookieService,DatePipe,AuthenUserGuard,AuthenService,{provide:LocationStrategy,useClass:HashLocationStrategy} ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
