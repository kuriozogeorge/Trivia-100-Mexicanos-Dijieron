import { Pregunta } from "./preguntas";

export interface Encuesta {
    key: string | null;
    titulo: string; 
    preguntas: Array<Pregunta>   
}