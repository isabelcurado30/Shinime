import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AnimesComponent } from './animes/animes.component';
import { RetoAnualComponent } from './reto-anual/reto-anual.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Página Principal
  { path: 'animes', component: AnimesComponent},
  { path: 'reto-anual', component: RetoAnualComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
