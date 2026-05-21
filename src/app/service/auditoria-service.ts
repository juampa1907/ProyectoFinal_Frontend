import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auditoria } from '../models/auditoria';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private api: string = 'http://localhost:8080/ProyectoFinal_Backend/api/auditoria/';

  constructor(private http: HttpClient) {}

  getAuditoriaList(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.api + 'getAll');
  }

  putAuditoria(auditoria: any): Observable<Auditoria> {
    return this.http.put<Auditoria>(this.api + 'updateAuditoria', auditoria);
  }

  deleteAuditoria(id: number): Observable<void> {
    return this.http.delete<void>(this.api + 'deleteAuditoria/' + id);
  }
}
