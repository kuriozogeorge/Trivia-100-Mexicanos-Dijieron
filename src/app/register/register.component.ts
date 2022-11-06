import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Service } from '../components/firebase/services.component';
import { Encuesta } from '../components/models/encuentas';
import { Trivias } from '../components/models/trivias';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private _success = new Subject<string>();

	staticAlertClosed = false;
	successMessage = '';
  key: string | null;
  encuestas: Encuesta[];
  isChecked: boolean | false;

  constructor(
    public apiService: Service,
    private router: Router
  ){}

	@ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  ngOnInit(): void {
    this.cargarEncuentas();   
    

		this._success.subscribe((message) => (this.successMessage = message));
		this._success.pipe(debounceTime(5000)).subscribe(() => {
			if (this.selfClosingAlert) {
				this.selfClosingAlert.close();
			}
		});

    this.triviaForm.get('triviaDateCreate')?.setValue(new Date().toLocaleString());
  }

  triviaForm = new FormGroup({
    triviaName: new FormControl(''),
    triviaNameGroup1: new FormControl(''),
    triviaNameGroup2: new FormControl(''),
    triviaQuestions: new FormControl(''),
    triviaTermConditions: new FormControl(''),
    triviaQuestion: new FormControl(''),
    triviaPointsGroup1: new FormControl(''),
    triviaPointsGroup2: new FormControl(''),
    triviaStrike: new FormControl(''),
    triviaWinName: new FormControl(''),
    triviaDateCreate: new FormControl('')
  });

  encuestaForm : FormGroup;

  onSubmit() {
    this.apiService.endTrivida();
    let data : Trivias = this.triviaForm.value;
   
    if( data.triviaTermConditions && data.triviaQuestion!='0'){ 
      this.apiService.addTrivia(data);
      this.router.navigate(['/playing']);
    }else{      
      this._success.next(this.validateInputForm(data));
    }
  }

  cargarEncuentas(){
     let data = this.apiService.getEncuentas();

     data.snapshotChanges().subscribe( x => {
        this.encuestas = [];        
        x.forEach(item => { 
          let a = item.payload.toJSON() as Encuesta; 
          a['key'] = item.key;
          this.encuestas.push(a as Encuesta);
        });
     });

  }

  cargaEncuenta(){
    let key = this.triviaForm.get('triviaQuestion')?.value;
    let data = this.apiService.getEncuenta(key);
    data.valueChanges().subscribe( (x) => {  
      this.triviaForm.get('triviaQuestions')?.setValue(x);
    });
  }

  validateInputForm(data : Trivias){
    let message = "";
      if( !data.triviaTermConditions ){
        message = message.concat(" Acepte los terminos y condiciones.<br />");
      }
      if( data.triviaQuestion =='0' ){
        message = message.concat(" Seleccione una encuesta de la lista.<br />");
      }
      if( data.triviaName.length==0 ){
        message = message.concat(" Ingrese un titulo de trivia.<br />");
      }
      if( data.triviaNameGroup1.length==0 ){
        message = message.concat(" Ingrese un nombre para el primer grupo.<br />");
      }
      if( data.triviaNameGroup2.length==0 ){
        message = message.concat(" Ingrese un nombre para el segundo grupo.<br />");
      }
      return message;
  }

}
