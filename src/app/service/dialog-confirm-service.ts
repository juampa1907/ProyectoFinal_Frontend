import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogConfirmService {
  private abrirSubject = new Subject<number>();
  abrir$ = this.abrirSubject.asObservable();

  abrir(id: number) {
    this.abrirSubject.next(id);
  }
}
