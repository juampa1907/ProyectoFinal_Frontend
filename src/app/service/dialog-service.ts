import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogSubject = new Subject<{ mensaje: string; tipo: 'error' | 'exito' }>();
  dialog$ = this.dialogSubject.asObservable();

  constructor(private zone: NgZone) { }

  mostrar(mensaje: string, tipo: 'error' | 'exito') {
    this.zone.run(() => {
      this.dialogSubject.next({ mensaje, tipo });
    })
  }

  limpiar() {
    this.dialogSubject = new Subject();
    this.dialog$ = this.dialogSubject.asObservable();
  }
}
