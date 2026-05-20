import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DashboardDataService } from '../../service/dashboard-service';

@Component({
  selector: 'app-auditoria',
  imports: [MatIcon],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class Auditoria implements OnInit, OnDestroy {
  totalUsuarios = signal<number>(0);
  totalEquiposActivos = signal<number>(0);
  faseActual = signal<string>('Sin definir');

  private suscripciones: Subscription[] = [];

  constructor(private dashboardService: DashboardDataService) {}

  ngOnInit(): void {
    this.suscripciones.push(
      this.dashboardService.totalUsuarios$.subscribe((val) => this.totalUsuarios.set(val)),
      this.dashboardService.totalEquiposActivos$.subscribe((val) => this.totalEquiposActivos.set(val)),
      this.dashboardService.faseActual$.subscribe((val) => this.faseActual.set(val)),
    );

    this.dashboardService.cargar();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach((s) => s.unsubscribe());
  }
}
