import { Injectable } from "@angular/core";
import { Trivias } from "../models/trivias";
import { Encuesta } from "../models/encuentas";
import {
    AngularFireDatabase,
    AngularFireList,
    AngularFireObject,
  } from '@angular/fire/compat/database';
import { Pregunta } from "../models/preguntas";
import { Respuesta } from "../models/respuestas";

  @Injectable({
    providedIn: 'root'
  })

  export class Service {
    pruebasRef: AngularFireList<any>;
    pruebaRef: AngularFireObject<any>;
    encuestasRef: AngularFireList<any>
    encuestaRef: AngularFireObject<any>
    preguntaRef: AngularFireObject<any>;
    respuestaRef: AngularFireObject<any>;
    key: string | null;

    constructor(private db : AngularFireDatabase){
        this.pruebasRef = this.db.list('trivias');        
    }

    addTrivia(trivia : Trivias){
        this.pruebasRef.push({
            triviaName: trivia.triviaName,
            triviaNameGroup1: trivia.triviaNameGroup1,
            triviaNameGroup2: trivia.triviaNameGroup2,
            triviaQuestions: trivia.triviaQuestions,
            triviaTermConditions: trivia.triviaTermConditions,
            triviaQuestion : trivia.triviaQuestion,
            triviaAdmin: false,
            triviaStrike: 0,
            triviaPointsGroup1: 0,
            triviaPointsGroup2: 0,
            triviaDateCreate: trivia.triviaDateCreate,
            triviaWinName: "",
            triviaTotalPoints: 0,
            triviaActivarStrike: false
        }).then( response=>{
            console.log( JSON.stringify(response.key) );
            localStorage.setItem('key',JSON.stringify(response.key));
        });
       //return this.key;
    }

    getTrivia(id : string){
        this.pruebaRef = this.db.object('trivias/' + id);
        return this.pruebaRef;
    }

    getTrivias(){
        this.pruebasRef = this.db.list('trivias');
        return this.pruebasRef;
    }

    updateTrivia(prueba : Trivias ){
        this.pruebaRef.update({
            triviaName: prueba.triviaName,
            triviaNameGroup1: prueba.triviaNameGroup1,
            triviaNameGroup2: prueba.triviaNameGroup2,
            triviaQuestions: prueba.triviaQuestions,
            triviaTermConditions: prueba.triviaTermConditions,
            triviaQuestion : prueba.triviaQuestion,
            triviaAdmin: prueba.triviaAdmin,
            triviaPointsGroup1: prueba.triviaPointsGroup1,
            triviaPointsGroup2: prueba.triviaPointsGroup2,
            triviaStrike: prueba.triviaStrike,
            triviaWinName: prueba.triviaWinName,
            triviaTotalPoints: prueba.triviaTotalPoints,
            triviaActivarStrike: prueba.triviaActivarStrike
        });
    }

    deleteTrivia(id : string){
        this.pruebaRef = this.db.object('trivias/' + id);
        this.pruebaRef.remove();
    }

    getEncuentas(){
        this.encuestasRef = this.db.list('encuesta');
        return this.encuestasRef;
    }

    getEncuesta(key : string){
        let url = 'encuesta/'+key;
        this.encuestaRef = this.db.object(url);
        return this.encuestaRef;
    }

    endTrivida(){
        localStorage.removeItem('key');
    } 
    
    updatePregunta(pregunta : Pregunta, key : string, index : number ){
        let url = 'trivias/' + key + "/triviaQuestions/preguntas/" + index;
        this.preguntaRef = this.db.object( url );
        this.preguntaRef.update({
            pregunta: pregunta.pregunta, 
            respuestas: pregunta.respuestas, 
            activo: pregunta.activo, 
        });
    }

    updateRespuesta(respuesta : Respuesta, key : string, index : number, indexR : number ){
        let url = 'trivias/' + key + "/triviaQuestions/preguntas/" + index + '/respuestas/' + indexR;
        this.respuestaRef = this.db.object( url );
        this.respuestaRef.update({
            respuesta: respuesta.respuesta, 
            puntos: respuesta.puntos, 
            activo: respuesta.activo, 
        });
    }

    deletePreguntas( key : string ){
        let url = 'trivias/' + key + "/triviaQuestions";
        this.preguntaRef = this.db.object( url );
        this.preguntaRef.remove();
    }

    addEncuentas(encuesta : Encuesta){
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        let encuestaKey = '' as any;
        this.encuestasRef = this.db.list('encuesta');
        this.encuestasRef.push({
            titulo: encuesta.titulo,
            preguntas: encuesta.preguntas
        }).then( response=>{
            encuestaKey = response.key;
            localStorage.setItem('keyEncuesta',JSON.stringify(response.key));
        });

        return encuestaKey;
    }

    deleteEncuesta(key : string){
        let url = 'encuesta/'+key;
        this.encuestaRef = this.db.object(url);
        this.encuestaRef.remove();
    }


  }