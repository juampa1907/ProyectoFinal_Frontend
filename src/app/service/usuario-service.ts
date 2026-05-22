import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { UsuarioCreacion } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/usuario/';

  constructor(private http: HttpClient) {}

  getUsuarioList(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api + 'getAll');
  }

  loginUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.api + 'login', usuario);
  }

  saveUsuario(usuario: UsuarioCreacion): Observable<Usuario> {
    return this.http.post<Usuario>(this.api + 'saveUsuario', usuario);
  }

  enviarCodigoVerificacion(usuario: UsuarioCreacion): Observable<void> {
    return this.http.post<void>(this.api + 'enviarCodigoVerificacion', usuario);
  }

  registrarUsuario(usuario: UsuarioCreacion, codigo: string): Observable<Usuario> {
    return this.http.post<Usuario>(this.api + 'registrar?codigoVerificacion=' + codigo, usuario);
  }

  putUsuario(usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(this.api + 'updateUsuario', usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteUsuario/' + id);
  }
}
