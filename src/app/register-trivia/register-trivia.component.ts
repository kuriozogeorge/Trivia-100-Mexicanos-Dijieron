import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { CargaEncuesta } from '../components/models/cargaCuestionario';
import { Encuesta } from '../components/models/encuentas';
import { Pregunta } from "../components/models/preguntas";
import { Respuesta } from "../components/models/respuestas";
import { Service } from '../components/firebase/services.component';

@Component({
  selector: 'app-register-trivia',
  templateUrl: './register-trivia.component.html',
  styleUrls: ['./register-trivia.component.scss']
})
export class RegisterTriviaComponent implements OnInit {

  valid: boolean;
  text: string;
  data: Array<CargaEncuesta>;
  cuestionario: Encuesta;
  tituloFlag: boolean;
  key: any;
  loading: boolean;
  editQuestionForm = new FormGroup({
    editQuestionName: new FormControl('')
  });

  constructor(public apiService: Service) { }

  ngOnInit(): void {
  }

  questionForm = new FormGroup({
    questionName: new FormControl(''),
    questionFile: new FormControl('')
  });

  onFileChange(event : any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {      
      const [file] = event.target.files;

      if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /*|| 
            file.type == "text/plain"*/) {
        this.valid=false;     
        this.readFile(file);   
      } else {
        this.valid=true;
        this.questionForm.get('questionFile')?.setValue('');
      }
    }
  }

  onSubmit() {
    const titulo = this.questionForm.get('questionName')?.value;
    let count = 10;

    if (titulo!=='') {
      this.tituloFlag = false;
      const encuesta = {} as Encuesta;
      encuesta.titulo = titulo;
      encuesta.preguntas = [];
  
      for (const item of this.data) {
        const pregunta = {} as Pregunta;            
        pregunta.pregunta = item.pregunta;       
        pregunta.respuestas = [];
  
        for (const res of this.data) {
          if (item.pregunta == res.pregunta) {
            const respuesta = {} as Respuesta;  
            respuesta.activo = false;
            respuesta.respuesta = res.respuesta;
            respuesta.puntos = res.puntos;        
            pregunta.respuestas.push(respuesta);
  
            if (!this.validateIfExist(encuesta.preguntas, res.pregunta)) {
              encuesta.preguntas.push(pregunta);
            }
          }                  
        }            
      }      
      this.executeService(encuesta);
    } else {
      this.tituloFlag = true;
    }    
    
  }  

  readFile(file: any) {
    let type = file.type;
    switch(type) {
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        this.readPDF(file);
        break;
      case "text/plain":
        this.readTxt(file);
        break;
    }
  }

  readTxt(file: any) {
    const reader = new FileReader();
    this.text = "";
    reader.readAsText(file);
    reader.onload = () => {
       //this.text = (reader.result);          
      /*if (txt != undefined) {
        //const splitTxt[] = txt.split(".");
        if (txt.includes("Pregunta")) {
          console.log("Si Pregunta: "+txt);
        }   
        if (txt.includes("Respuesta")) {
          console.log("Si Respuesta: "+txt);
        }
      }*/
    }
    console.log("TEXT: "+this.text); 
        
  }

  readPDF(file: any) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.data = XLSX.utils.sheet_to_json(worksheet);     
    };
  }

  validateIfExist(array : Array<Pregunta>, title : string){
    return array.some(
      (item : Pregunta) => JSON.stringify(item.pregunta) === JSON.stringify(title)
    );
  }

  executeService(encuesta : Encuesta){
    this.loading = true;
    this.apiService.addEncuentas(encuesta);
    setTimeout(() => {
      this.key = JSON.parse(localStorage.getItem('keyEncuesta')!);
      this.loading = false;
    }, 9000);          
  }

  cargarEncuesta(){
    console.log("CLICK");
    let data = this.apiService.getEncuesta(this.key);
    data.valueChanges().subscribe( (x) => {  
      this.cuestionario = x;
    });
    //this.cuestionario = this.apiService.getEncuesta(this.key);
  }

  eliminarEncuesta(){
    this.apiService.deleteEncuesta(this.key);
    this.key=null;
  }

}
