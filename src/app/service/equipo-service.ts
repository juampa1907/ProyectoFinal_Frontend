import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/equipo/';

  constructor(private http: HttpClient) {}

  getEquipoList(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.api + 'getAll');
  }

  saveEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.api + 'saveEquipo', equipo);
  }

  putEquipo(equipo: any): Observable<Equipo> {
    return this.http.put<Equipo>(this.api + 'updateEquipo', equipo);
  }

  deleteEquipo(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteEquipo/' + id);
  }
}
