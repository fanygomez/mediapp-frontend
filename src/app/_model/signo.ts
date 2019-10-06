import { Paciente } from "./paciente";
import { NumberFormatStyle } from '@angular/common';

export class Signo {
    idSigno: number;
    paciente: Paciente;
    fecha: string;
    temperatura: string;
    pulso: string;
    // tslint:disable-next-line: variable-name
    ritmo_respiratorio: string;
}
