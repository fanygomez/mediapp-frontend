import { Paciente } from './../../../_model/paciente';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/_service/paciente.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {
  paciente: Paciente;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  direccion: string;
  telefono: string;
  constructor(private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    // tslint:disable-next-line: align
    private route: ActivatedRoute,
              private router: Router, private pacienteService: PacienteService) { }

  ngOnInit() {
    this.limpiarControles();
  }

  operar() {
    this.paciente = new Paciente(); //hay que enviar el id del paciente
    this.paciente.idPaciente = null;
    this.paciente.nombres =   this.nombres;
    this.paciente.apellidos = this.apellidos;
    this.paciente.email = this.email;
    this.paciente.dni =       this.dni;
    this.paciente.direccion = this.direccion;
    this.paciente.telefono =  this.telefono;

    this.pacienteService.registrar(this.paciente).pipe(switchMap(p => {
        return this.pacienteService.listarUltimoId();
       })).subscribe(paciente => {
         this.pacienteService.pacienteCreado.next(paciente);
         this.pacienteService.btnNuevoPaciente.next(false);
         this.pacienteService.mensajeCambio.next('SE REGISTRO');
      });
    this.dialogRef.close();
  }
  cancelar() {
    this.dialogRef.close();
  }
  limpiarControles() {
    this.nombres = '';
    this.apellidos = '';
    this.email = '';
    this.dni = '';
    this.direccion = '';
    this.telefono = '';
  }
}
