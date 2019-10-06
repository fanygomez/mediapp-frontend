import { Paciente } from './../../../_model/paciente';
import { PacienteDialogoComponent } from './../paciente-dialogo/paciente-dialogo.component';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoService } from './../../../_service/signo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Signo } from 'src/app/_model/signo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatSnackBar, MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  pacientes: Paciente[] = [];
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  myControlPaciente: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  pacienteSeleccionado: Paciente;
  esNuevo = false;
  p: string;
  @ViewChild(MatAutocomplete, { static: true }) matAutocomplete: MatAutocomplete;

  // tslint:disable-next-line: max-line-length
  constructor(private signoService: SignoService, private pacienteService: PacienteService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.edicion = params.id != null;
      this.initForm();
      // this.myControlPaciente.valueChanges.subscribe(val => {
      //   this.myControlPaciente = new FormControl(val)
      // });
    });
    this.esNuevo = false;
    this.listarPacientes();
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));

    this.pacienteService.pacienteCreado.subscribe(data => {
      this.listarPacientes();
      this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(data.nombres)));
      // tslint:disable-next-line: no-unused-expression
      this.myControlPaciente = new FormControl(data); //asingar al input
      });
    this.pacienteService.btnNuevoPaciente.subscribe(data => {
      this.esNuevo = data;
    });
  }
  filterValue(value: string) {
    return value.toLocaleLowerCase();
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      // tslint:disable-next-line: prefer-const
      let result =  this.pacientes.filter(option =>
        // tslint:disable-next-line: max-line-length
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
      return result;
      } else {
         // tslint:disable-next-line: prefer-const
        let result =  this.pacientes.filter(option =>
          // tslint:disable-next-line: max-line-length
          option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val.toLowerCase()));
        if (typeof result !== 'undefined' && result.length > 0) {
          this.esNuevo = false;
        } else {
          this.esNuevo = true;
        }
        return result;
    }
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  nuevoPaciente() {
    this.openDialog();
  }

  initForm() {
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          id: new FormControl(data.idSigno),
          paciente: new FormControl(data.paciente),
          fecha: new FormControl(new Date(data.fecha)),
          temperatura: new FormControl(data.temperatura),
          pulso: new FormControl(data.pulso),
          ritmo: new FormControl(data.ritmo_respiratorio)
        });
      });
    }
  }
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  procesar() {
    // tslint:disable-next-line: no-unused-expression
    let signo = new Signo();
    signo.idSigno = this.form.value.id;
    signo.paciente = this.myControlPaciente.value === null ? this.form.value.paciente : this.myControlPaciente.value;
    signo.temperatura = this.form.value.temperatura;
    signo.pulso = this.form.value.pulso;
    signo.ritmo_respiratorio = this.form.value.ritmo;
    signo.fecha = this.form.value.fecha;

    if (this.edicion) {
      this.signoService.modificar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      this.signoService.registrar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signo']);

  }
  openDialog() {
    this.dialog.open(PacienteDialogoComponent, {
      width: '400px',
    });
  }
}
