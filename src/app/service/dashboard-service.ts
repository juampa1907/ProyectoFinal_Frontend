import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from './usuario-service';
import { EquipoService } from './equipo-service';
import { PartidoService } from './partido-service';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private totalUsuarios = new BehaviorSubject<number>(0);
  private totalEquiposActivos = new BehaviorSubject<number>(0);
  private faseActual = new BehaviorSubject<string>('Sin definir');

  totalUsuarios$ = this.totalUsuarios.asObservable();
  totalEquiposActivos$ = this.totalEquiposActivos.asObservable();
  faseActual$ = this.faseActual.asObservable();

  private readonly ordenFases = [
    { valor: 'Grupos', label: 'GRUPOS' },
    { valor: 'Dieciseis', label: '16°' },
    { valor: 'Octavos', label: '8°' },
    { valor: 'Cuartos', label: '4°' },
    { valor: 'Semifinal', label: 'SEMIS' },
    { valor: 'Final', label: 'FINAL' },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private equipoService: EquipoService,
    private partidoService: PartidoService,
  ) {}

  cargar(): void {
    this.cargarUsuarios();
    this.cargarEquiposActivos();
    this.cargarFaseActual();
  }

  private cargarUsuarios(): void {
    this.usuarioService.getUsuarioList().subscribe({
      next: (data) => {
        this.totalUsuarios.next(data.length);
      },
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  private cargarEquiposActivos(): void {
    this.equipoService.getEquipoList().subscribe({
      next: (data) => {
        this.totalEquiposActivos.next(data.filter((e) => e.estado === 'A').length);
      },
      error: (err) => console.error('Error al cargar equipos:', err),
    });
  }

  private cargarFaseActual(): void {
    this.partidoService.getPartidoList().subscribe({
      next: (partidos) => {
        for (const fase of this.ordenFases) {
          const hayActivos = partidos.some((p) => p.fase === fase.valor && p.estado === 'A');
          if (hayActivos) {
            this.faseActual.next(fase.label);
            break;
          }
        }
      },
      error: (err) => console.error('Error al cargar partidos:', err),
    });
  }
}
