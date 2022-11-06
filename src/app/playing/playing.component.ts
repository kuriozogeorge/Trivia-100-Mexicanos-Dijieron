import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Service } from '../components/firebase/services.component';
import { Trivias } from '../components/models/trivias';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit {

  trivia: Trivias;
  active = false;
  key: string;

  constructor(
    public apiService: Service
    ) {}

  ngOnInit(): void {
    this.key = JSON.parse(localStorage.getItem('key')!);
    document.body.className = "playing";
    this.cargarEncuentas();
    console.log(this.key);
  }

  cargarEncuentas(){
    this.key = JSON.parse(localStorage.getItem('key')!);
    this.apiService.getTrivia(this.key)
    .valueChanges().subscribe( (x) => {        
      this.trivia = x as Trivias;
    });

 }

  activate(){
    this.active=true;
    //this.reproducir();
  }

  desabled(){
    this.active=false;
  }

  reproducir() {
    const audio = new Audio('../../assets/audio/correcto.mp3');
    audio.play();
  }

  counterStrike(strike : number){
    return Array(strike);
  }

}
