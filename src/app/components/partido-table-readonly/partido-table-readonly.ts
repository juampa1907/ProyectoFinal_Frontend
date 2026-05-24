import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Partido } from '../../models/partido';
import { PartidoService } from '../../service/partido-service';
import { EquipoService } from '../../service/equipo-service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-partido-table-readonly',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './partido-table-readonly.html',
  styleUrl: './partido-table-readonly.css',
})
export class PartidoTableReadOnly implements OnInit {
  partidosData: Partido[] = [];
  equipos: Equipo[] = [];
  filterText = '';

  constructor(
    private partidoService: PartidoService,
    private equipoService: EquipoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.listPartidos();
    this.listEquipos();
  }

  get partidosFiltrados(): Partido[] {
    if (!this.filterText.trim()) return this.partidosData;
    const term = this.filterText.toLowerCase();
    return this.partidosData.filter((p) => {
      const local = this.getNombreEquipo(p.idEquipoLocal).toLowerCase();
      const visitante = this.getNombreEquipo(p.idEquipoVisitante).toLowerCase();
      const fase = this.getFaseNombre(p.fase).toLowerCase();
      return (
        local.includes(term) ||
        visitante.includes(term) ||
        fase.includes(term) ||
        p.golesLocal.toString().includes(term) ||
        p.golesVisitante.toString().includes(term) ||
        p.fechaHora.toLowerCase().includes(term) ||
        p.estado.toLowerCase().includes(term)
      );
    });
  }

  listPartidos(): void {
    this.partidoService.getPartidoList().subscribe({
      next: (data) => {
        this.partidosData = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  listEquipos(): void {
    this.equipoService.getEquipoList().subscribe({
      next: (data) => {
        this.equipos = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  applyFilter(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value;
  }

  getBanderaEquipo(idEquipo: number): string {
    const equipo = this.equipos.find((e) => e.idEquipo === idEquipo);
    return equipo?.bandera ?? '';
  }

  getNombreEquipo(idEquipo: number): string {
    const equipo = this.equipos.find((e) => e.idEquipo === idEquipo);
    return equipo?.nombre ?? 'Sin equipo';
  }

  getFaseNombre(fase: string): string {
    switch (fase) {
      case 'Grupos': return 'GRUPOS';
      case 'Dieciseis': return 'DIECISEISAVOS';
      case 'Octavos': return 'OCTAVOS';
      case 'Cuartos': return 'CUARTOS';
      case 'Semifinal': return 'SEMIFINAL';
      case 'Final': return 'FINAL';
      default: return fase;
    }
  }

  getEstadoNombre(estado: string): string {
    switch (estado) {
      case 'A': return 'ACTIVO';
      case 'I': return 'INACTIVO';
      default: return 'desconocido';
    }
  }

  formatFechaHora(fechaHora: string): string {
    if (!fechaHora) return '-';
    const [datePart, timePart] = fechaHora.split('T');
    if (!datePart || !timePart) return fechaHora;
    const [y, m, d] = datePart.split('-').map(Number);
    const [h, min] = timePart.split(':').map(Number);
    return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }
}
