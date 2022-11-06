import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RegisterTriviaComponent } from './register-trivia/register-trivia.component';
import { PlayingComponent } from './playing/playing.component';

const routes: Routes = [
    { path: 'playing', component: PlayingComponent },
    { path: 'trivia', component: RegisterTriviaComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: HomeComponent },
    { path: '**', component: PagenotfoundComponent }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
