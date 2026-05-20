import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partido } from '../models/partido';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/partido/';

  constructor(private http: HttpClient) {}

  getPartidoList(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.api + 'getAll');
  }

  savePartido(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(this.api + 'savePartido', partido);
  }

  putPartido(partido: any): Observable<Partido> {
    return this.http.put<Partido>(this.api + 'updatePartido', partido);
  }

  deletePartido(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deletePartido/' + id);
  }
}
