import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();

  notificarActualizacion(): void {
    this.perfilActualizado.next(true);
  }

  reiniciarNotificacion(): void {
    this.perfilActualizado.next(false);
  }
}