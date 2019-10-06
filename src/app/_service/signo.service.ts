import { Injectable } from '@angular/core';
import { Signo } from '../_model/signo';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignoService {
  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/signos`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Signo[]>(this.url);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listarPorId(idSigno: number) {
    return this.http.get<Signo>(`${this.url}/${idSigno}`);
  }

  registrar(signo: Signo) {
    return this.http.post(this.url, signo);
  }

  modificar(signo: Signo) {
    return this.http.put(this.url, signo);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/${idSigno}`);
  }
}
