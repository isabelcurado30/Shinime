import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnimesComponent } from './pages/animes/animes.component';
import { AnimeDetailComponent } from './pages/anime-detail/anime-detail.component';
import { AnnualChallengeComponent } from './pages/annual-challenge/annual-challenge.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ListasComponent } from './pages/listas/listas.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animes', component: AnimesComponent },
  { path: 'animes/:id', component: AnimeDetailComponent},
  { path: 'annual-challenge', component: AnnualChallengeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'listas', component: ListasComponent }
];

@NgModule ({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
