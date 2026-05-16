import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogSubject = new Subject<{ mensaje: string; tipo: 'error' | 'exito' }>();
  dialog$ = this.dialogSubject.asObservable();

  mostrar(mensaje: string, tipo: 'error' | 'exito') {
    this.dialogSubject.next({ mensaje, tipo });
  }
}
