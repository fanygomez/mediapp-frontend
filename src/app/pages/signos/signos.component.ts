import { Signo } from './../../_model/signo';
import { SignoService } from './../../_service/signo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  displayedColumns = ['idSigno', 'paciente', 'pulso', 'ritmoRespiratorio', 'temperatura', 'acciones'];
  dataSource: MatTableDataSource<Signo>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  cantidad: number = 0;
  // tslint:disable-next-line: max-line-length
  constructor(private signoService: SignoService , private dialog: MatDialog , private snackBar: MatSnackBar, public route: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.signoService.signoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    // this.signoService.listar().subscribe(data => {
    //   this.dataSource = new MatTableDataSource(data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
    this.signoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(signo?: Signo) {
    const signov = signo != null ? signo : new Signo();

    this.dialog.open(SignosComponent, {
      width: '400px',
      data: signov
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  eliminar(signo: Signo) {
    this.signoService.eliminar(signo.idSigno).pipe(switchMap(() => {
      return this.signoService.listar();
    })).subscribe(data => {
      this.signoService.signoCambio.next(data);
      this.signoService.mensajeCambio.next('Se Elimino');
    });
  }
  mostrarMas(e : any){
    //console.log(e);
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
