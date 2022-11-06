import { Trivias } from "./trivias";

export interface Registro{
    $key: string;
    encuesta: any;
    trivia: Trivias;
}