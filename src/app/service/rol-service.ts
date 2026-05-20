import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/rol/';

  constructor(private http: HttpClient) {}

  getRolList(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.api + 'getAll');
  }

  saveRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.api + 'saveRol', rol);
  }

  putRol(rol: any): Observable<Rol> {
    return this.http.put<Rol>(this.api + 'updateRol', rol);
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteRol/' + id);
  }
}
