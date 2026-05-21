import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estadio } from '../models/estadio';

@Injectable({
  providedIn: 'root',
})
export class EstadioService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/estadio/';

  constructor(private http: HttpClient) {}

  getEstadioList(): Observable<Estadio[]> {
    return this.http.get<Estadio[]>(this.api + 'getAll');
  }

  saveEstadio(estadio: Estadio): Observable<Estadio> {
    return this.http.post<Estadio>(this.api + 'saveEstadio', estadio);
  }

  putEstadio(estadio: any): Observable<Estadio> {
    return this.http.put<Estadio>(this.api + 'updateEstadio', estadio);
  }

  deleteEstadio(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteEstadio/' + id);
  }
}
