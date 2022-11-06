import { Respuesta } from "./respuestas";

export interface Pregunta {
    pregunta: string; 
    respuestas: Array<Respuesta>;
    activo: boolean
}