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
import { StatusTranslatePipe } from './pipes/status-translate/status-translate.pipe';
import { RatingTranslatePipe } from './pipes/rating-translate/rating-translate.pipe';
import { GenresTranslatePipe } from './pipes/genres-translate/genres-translate.pipe';
import { CommonModule } from '@angular/common';
import { AnnualChallengeComponent } from './pages/annual-challenge/annual-challenge.component';

@NgModule ({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AnimesComponent,
    AnimeDetailComponent,
    StatusTranslatePipe,
    RatingTranslatePipe,
    GenresTranslatePipe,
    AnnualChallengeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
