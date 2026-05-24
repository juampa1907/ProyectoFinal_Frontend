import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Partido } from '../../models/partido';
import { PartidoService } from '../../service/partido-service';
import { EquipoService } from '../../service/equipo-service';
import { DashboardDataService } from '../../service/dashboard-service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreatePartido } from '../dialogs/create-partido/create-partido';
import { DialogEditPartido } from '../dialogs/dialog-edit-partido/dialog-edit-partido';
import { DialogConfirmEliminar } from '../dialogs/dialog-confirm-eliminar/dialog-confirm-eliminar';
import { DialogConfirmService } from '../../service/dialog-confirm-service';
import { DialogService } from '../../service/dialog-service';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-partido-table',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    CreatePartido,
    DialogEditPartido,
    DialogConfirmEliminar,
  ],
  templateUrl: './partido-table.html',
  styleUrl: './partido-table.css',
})
export class PartidoTable implements OnInit {
  partidosData: Partido[] = [];
  equipos: Equipo[] = [];
  filterText = '';

  constructor(
    private partidoService: PartidoService,
    private equipoService: EquipoService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    public dialogConfirmService: DialogConfirmService,
    private dialogService: DialogService,
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

  @ViewChild('dialogCrear') dialogCrear!: CreatePartido;

  onPartidoCreado(payload: any): void {
    this.partidoService.savePartido(payload).subscribe({
      next: () => {
        this.dialogCrear.cerrarConExito();
        this.dialogService.mostrar('Partido creado correctamente', 'exito');
        this.listPartidos();
        this.dashboardService.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dialogCrear.cerrarConError();
        this.dialogService.mostrar(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : `Error ${err.status}: Ocurrió un error al crear el partido`,
          'error',
        );
      },
    });
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditPartido;

  onPartidoEditado(event: { id: number; data: any }): void {
    const payload = {
      idPartido: event.id,
      idEquipoLocal: event.data.idEquipoLocal,
      idEquipoVisitante: event.data.idEquipoVisitante,
      fase: event.data.fase,
      golesLocal: event.data.golesLocal,
      golesVisitante: event.data.golesVisitante,
      fechaHora: event.data.fechaHora,
      estado: event.data.estado,
    };

    this.partidoService.putPartido(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.dialogService.mostrar('Partido actualizado correctamente', 'exito');
        this.listPartidos();
        this.dashboardService.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dialogEditar.cerrarConError();
        this.dialogService.mostrar(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : `Error ${err.status}: Ocurrió un error al actualizar el partido`,
          'error',
        );
      },
    });
  }

  @ViewChild('dialogConfirm') dialogConfirm!: DialogConfirmEliminar;

  onEliminarPartido(id: number): void {
    this.partidoService.deletePartido(id).subscribe({
      next: () => {
        this.dialogConfirm.cerrarConExito();
        this.dialogService.mostrar('Partido eliminado correctamente', 'exito');
        this.listPartidos();
        this.dashboardService.cargar();
        this.cdr.detectChanges();
      },
      error: () => {
        this.dialogConfirm.cerrarConError();
        this.dialogService.mostrar('Ocurrió un error al eliminar el partido', 'error');
      },
    });
  }

  onAbrirEliminar(partido: Partido): void {
    this.dialogConfirmService.abrir(partido.idPartido, 'PARTIDO');
  }
}
