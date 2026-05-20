import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogConfirmData {
  id: number;
  entidad?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogConfirmService {
  private abrirSubject = new Subject<DialogConfirmData>();
  abrir$ = this.abrirSubject.asObservable();

  abrir(id: number, entidad?: string) {
    this.abrirSubject.next({ id, entidad });
  }
}
