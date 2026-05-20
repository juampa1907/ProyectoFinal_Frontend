import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../models/grupo';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/grupo/';

  constructor(private http: HttpClient) {}

  getGrupoList(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.api + 'getAll');
  }

  saveGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(this.api + 'saveGrupo', grupo);
  }

  putGrupo(grupo: any): Observable<Grupo> {
    return this.http.put<Grupo>(this.api + 'updateGrupo', grupo);
  }

  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteGrupo/' + id);
  }
}
