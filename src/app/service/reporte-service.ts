import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {

  private api : string = 'http://localhost:8080/ProyectoFinal_Backend/api/reporte/';

  constructor(private http:HttpClient){}

  descargarReporte():Observable<Blob>{
    return this.http.get(this.api + 'generar', {responseType: 'blob'})
  }
}
