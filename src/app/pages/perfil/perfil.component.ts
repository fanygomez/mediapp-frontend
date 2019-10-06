import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: string;
  roles: string[];
  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let decodedToken = helper.decodeToken(token);
    this.user = decodedToken.user_name;
    this.roles = decodedToken.authorities ;
  }
}
