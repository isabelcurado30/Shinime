import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnimesComponent } from './pages/animes/animes.component';
import { AnimeDetailComponent } from './pages/anime-detail/anime-detail.component';
import { AnnualChallengeComponent } from './pages/annual-challenge/annual-challenge.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animes', component: AnimesComponent },
  { path: 'animes/:id', component: AnimeDetailComponent},
  { path: 'annual-challenge', component: AnnualChallengeComponent }
];

@NgModule ({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
