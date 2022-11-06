import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { timeStamp } from 'console';
import { Service } from '../components/firebase/services.component';
import { Encuesta } from '../components/models/encuentas';
import { Pregunta } from '../components/models/preguntas';
import { Respuesta } from '../components/models/respuestas';
import { Trivias } from '../components/models/trivias';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  audioStrike = new Audio('../../assets/audio/strike.mp3');
  audioCorrecto = new Audio('../../assets/audio/correcto.mp3');
  audioVictoria = new Audio('../../assets/audio/timbre.mp4');
  audioInicio = new Audio('../../assets/audio/inicio.mp3');

  constructor(
    public apiService: Service
  ) { }

  trivia: Trivias;
  key: string;
  activarStrike: boolean;

  registerForm = new FormGroup({
    key: new FormControl('')
  });

  ngOnInit(): void {    
  }

  cargarEncuenta(){    
    this.apiService.getTrivia(this.key)
    .valueChanges().subscribe( (x) => {        
      this.trivia = x as Trivias;
    });
 }

  onSubmit(){
    let data =this.registerForm.value;
    this.key=data.key;
    this.cargarEncuenta();
  }

  iniciarJuego(){
    this.trivia.triviaAdmin=true;
    this.apiService.updateTrivia(this.trivia);
    this.audioInicio.play();
  }

  terminarJuego(){
    let point1 = this.trivia.triviaPointsGroup1;
    let point2 = this.trivia.triviaPointsGroup2;

    if( point1 > point2 ){
        this.trivia.triviaWinName = this.trivia.triviaNameGroup1;
    }else{
      this.trivia.triviaWinName = this.trivia.triviaNameGroup2;
    }

    this.trivia.triviaAdmin=false;
    this.apiService.updateTrivia(this.trivia);
    this.apiService.endTrivida();
    this.apiService.deletePreguntas(this.key);
  }

  activarPregunta(pregunta : Pregunta, index : number){  
    pregunta.activo=true;
    this.apiService.updatePregunta(pregunta,this.key,index);
  }

  activarRespuesta(respuesta : Respuesta, indexP : number, indexR : number, puntosR : number){ 
    this.sumarPuntos(puntosR); 
    respuesta.activo=true;
    this.apiService.updateRespuesta(respuesta,this.key,indexP,indexR);
    this.reproducir();
  }

  desactivarPregunta(pregunta : Pregunta, index : number){  
    pregunta.activo=false;
    this.apiService.updatePregunta(pregunta,this.key,index);
  }

  desactivarRespuesta(respuesta : Respuesta, indexP : number, indexR : number){  
    respuesta.activo=false;
    this.apiService.updateRespuesta(respuesta,this.key,indexP,indexR);
  }

  reproducir() {    
    this.audioCorrecto.play();
  }

  reproducirStrike() {    
    this.audioStrike.play();
    this.actualizarStrike();
  }

  reproducirVictoria() {
    this.audioVictoria.play();
  }

  sumarPuntosEquipo1( pregunta : Pregunta, index : number ){
    let actualPoints = this.trivia.triviaPointsGroup1;
    let totalPoints = this.trivia.triviaTotalPoints;
    this.trivia.triviaPointsGroup1= actualPoints+totalPoints;
    this.trivia.triviaTotalPoints = 0;
    this.apiService.updateTrivia(this.trivia);
    this.reproducirVictoria();
    this.completarPregunta(pregunta);
    this.desactivarPregunta(pregunta,index);
  }
  sumarPuntosEquipo2( pregunta : Pregunta, index : number ){
    let actualPoints = this.trivia.triviaPointsGroup2;
    let totalPoints = this.trivia.triviaTotalPoints;
    this.trivia.triviaPointsGroup2= actualPoints+totalPoints;
    this.trivia.triviaTotalPoints = 0;
    this.apiService.updateTrivia(this.trivia);
    this.reproducirVictoria();
    this.completarPregunta(pregunta);
    this.desactivarPregunta(pregunta,index);
  }

  sumarPuntos(puntosR : number){
    let puntosTotales = this.trivia.triviaTotalPoints;
    this.trivia.triviaTotalPoints = puntosTotales + puntosR;
    this.apiService.updateTrivia(this.trivia);
  }

  actualizarStrike(){
    this.activarStrike = true;
    let strike = this.trivia.triviaStrike;    
    if( strike < 3 ){
      this.trivia.triviaStrike = strike + 1;
    }else{
      this.trivia.triviaStrike = 0
      this.activarStrike = false;
    }    
    this.trivia.triviaActivarStrike=this.activarStrike;
    this.apiService.updateTrivia(this.trivia);
  }

  limpiarStrike(){
    this.trivia.triviaStrike = 0;
    this.trivia.triviaActivarStrike=false;
    this.apiService.updateTrivia(this.trivia);
  }

  completarPregunta(pregunta : Pregunta){
      pregunta.respuestas.forEach(element => {
        element.puntos=0;
      });
  }

}
