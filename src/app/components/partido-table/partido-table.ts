import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Partido } from '../../models/partido';
import { PartidoService } from '../../service/partido-service';
import { EquipoService } from '../../service/equipo-service';
import { DashboardDataService } from '../../service/dashboard-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-partido-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    CreatePartido,
    DialogEditPartido,
    DialogConfirmEliminar,
    DialogAlert,
  ],
  templateUrl: './partido-table.html',
  styleUrl: './partido-table.css',
})
export class PartidoTable implements OnInit {
  partidos = new MatTableDataSource<Partido>([]);
  equipos: Equipo[] = [];
  displayedColumns: string[] = [
    'idPartido',
    'idEquipoLocal',
    'idEquipoVisitante',
    'fase',
    'golesLocal',
    'golesVisitante',
    'fechaHora',
    'estado',
    'editar',
    'eliminar',
  ];

  constructor(
    private partidoService: PartidoService,
    private equipoService: EquipoService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    public dialogConfirmService: DialogConfirmService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.partidos.filterPredicate = (data: Partido, filter: string) => {
      const localNombre = this.getNombreEquipo(data.idEquipoLocal).toLowerCase();
      const visitanteNombre = this.getNombreEquipo(data.idEquipoVisitante).toLowerCase();
      const faseNombre = this.getFaseNombre(data.fase).toLowerCase();
      const searchText = filter.toLowerCase();
      return (
        data.idPartido.toString().includes(searchText) ||
        localNombre.includes(searchText) ||
        visitanteNombre.includes(searchText) ||
        faseNombre.includes(searchText) ||
        data.golesLocal.toString().includes(searchText) ||
        data.golesVisitante.toString().includes(searchText) ||
        data.fechaHora.toLowerCase().includes(searchText) ||
        data.estado.toLowerCase().includes(searchText)
      );
    };
    this.listPartidos();
    this.listEquipos();
  }

  listPartidos(): void {
    this.partidoService.getPartidoList().subscribe({
      next: (data) => {
        this.partidos.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR:', err);
      },
    });
  }

  listEquipos(): void {
    this.equipoService.getEquipoList().subscribe({
      next: (data) => {
        this.equipos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.partidos.filter = value.trim().toLowerCase();
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
      case 'Grupos':
        return 'GRUPOS';
      case 'Dieciseis':
        return 'DIECISEISAVOS';
      case 'Octavos':
        return 'OCTAVOS';
      case 'Cuartos':
        return 'CUARTOS';
      case 'Semifinal':
        return 'SEMIFINAL';
      case 'Final':
        return 'FINAL';
      default:
        return fase;
    }
  }

  getEstadoNombre(estado: string): string {
    switch (estado) {
      case 'A':
        return 'ACTIVO';
      case 'I':
        return 'INACTIVO';
      default:
        return 'desconocido';
    }
  }

  formatFechaHora(fechaHora: string): string {
    if (!fechaHora) return '-';
    const date = new Date(fechaHora);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${HH}:${min}`;
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
        console.error('Error al crear partido:', err);
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
        console.error('Error al actualizar partido:', err);
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
      error: (err) => {
        console.error('Error al eliminar partido:', err);
        this.dialogConfirm.cerrarConError();
        this.dialogService.mostrar(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : `Error ${err.status}: Ocurrió un error al eliminar el partido`,
          'error',
        );
      },
    });
  }

  onAbrirEliminar(partido: Partido): void {
    this.dialogConfirmService.abrir(partido.idPartido);
  }
}
