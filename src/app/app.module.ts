import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Template/header/header.component';
import { FooterComponent } from './Template/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, 
  MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,MatCardModule,
  MatSlideToggleModule,MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    CdkTableModule,
    MatTableModule,
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
    MatRadioModule, 
    MatSelectModule, 
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule ,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgbModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  exports:[MatTableModule]
})
export class AppModule {}
