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


  
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
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
  providers: [DatePipe ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
