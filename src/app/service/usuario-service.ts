import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { UsuarioCreacion } from '../models/usuario-creacion';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private api : string = 'http://localhost:8080/ProyectoFinal_Backend/api/proyecto/';

  constructor(private http: HttpClient){}

  getUsuarioList(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api + 'getAll');
  }

  loginUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.api + 'login', usuario);
  }

  saveUsuario(usuario: UsuarioCreacion): Observable<Usuario>{
    return this.http.post<Usuario>(this.api + 'saveUsuario', usuario);
  }
}
