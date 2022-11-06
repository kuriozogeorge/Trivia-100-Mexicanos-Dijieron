import { Encuesta } from "./encuentas";

export class Trivias {
    $key: string;
    triviaName: string;
    triviaNameGroup1: string;
    triviaNameGroup2: string;
    triviaPointsGroup1: number;
    triviaPointsGroup2: number;
    triviaQuestion: string;
    triviaTermConditions: boolean;
    triviaQuestions: Encuesta;
    triviaAdmin: boolean;
    triviaStrike: number;
    triviaWinName: string;
    triviaDateCreate: Date;
    triviaTotalPoints: number;
    triviaActivarStrike: boolean;
}