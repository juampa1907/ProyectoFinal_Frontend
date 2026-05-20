import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jugador } from '../models/jugador';

@Injectable({
  providedIn: 'root',
})
export class JugadorService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/jugador/';

  constructor(private http: HttpClient) {}

  getJugadorList(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(this.api + 'getAll');
  }

  saveJugador(jugador: Jugador): Observable<Jugador[]> {
    return this.http.post<Jugador[]>(this.api + 'saveJugador', [jugador]);
  }

  putJugador(jugador: any): Observable<Jugador> {
    return this.http.put<Jugador>(this.api + 'updateJugador', jugador);
  }

  deleteJugador(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteJugador/' + id);
  }
}
