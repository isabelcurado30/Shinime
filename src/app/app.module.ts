import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { AnimesComponent } from './pages/animes/animes.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnimeDetailComponent } from './pages/anime-detail/anime-detail.component';
import { StatusTranslatePipe } from './pipes/status-translate/status-translate.component';
import { RatingTranslateComponent } from './pipes/rating-translate/rating-translate.component';
import { GenresTranslateComponent } from './pipes/genres-translate/genres-translate.component';

@NgModule ({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AnimesComponent,
    AnimeDetailComponent,
    StatusTranslatePipe,
    RatingTranslateComponent,
    GenresTranslateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
