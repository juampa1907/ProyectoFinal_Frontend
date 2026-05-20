import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Equipo } from '../../models/equipo';
import { EquipoService } from '../../service/equipo-service';
import { DashboardDataService } from '../../service/dashboard-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogEditEquipo } from '../dialogs/dialog-edit-equipo/dialog-edit-equipo';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';

@Component({
  selector: 'app-equipo-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    DialogEditEquipo,
    DialogAlert,
  ],
  templateUrl: './equipo-table.html',
  styleUrl: './equipo-table.css',
})
export class EquipoTable implements OnInit {
  equipos = new MatTableDataSource<Equipo>([]);
  displayedColumns: string[] = ['bandera', 'nombre', 'idGrupo', 'entrenador', 'estado', 'editar'];

  constructor(
    private equipoService: EquipoService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.equipos.filterPredicate = (data: Equipo, filter: string) => {
      const searchText = filter.toLowerCase();
      return (
        data.nombre.toLowerCase().includes(searchText) ||
        data.idGrupo.toString().toLowerCase().includes(searchText) ||
        data.entrenador.toLowerCase().includes(searchText) ||
        data.estado.toLowerCase().includes(searchText)
      );
    };
    this.listEquipos();
  }

  listEquipos(): void {
    this.equipoService.getEquipoList().subscribe({
      next: (data) => {
        this.equipos.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.equipos.filter = value.trim().toLowerCase();
  }

  getGrupoNombre(idGrupo: string): string {
    switch (idGrupo) {
      case 'A':
        return 'Grupo A';
      case 'B':
        return 'Grupo B';
      case 'C':
        return 'Grupo C';
      case 'D':
        return 'Grupo D';
      case 'E':
        return 'Grupo E';
      case 'F':
        return 'Grupo F';
      case 'G':
        return 'Grupo G';
      case 'H':
        return 'Grupo H';
      case 'I':
        return 'Grupo I';
      case 'J':
        return 'Grupo J';
      case 'K':
        return 'Grupo K';
      case 'L':
        return 'Grupo L';
      default:
        return `Grupo ${idGrupo}`;
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

  @ViewChild('dialogEditar') dialogEditar!: DialogEditEquipo;

  onEquipoEditado(event: { id: number; data: any }): void {
    const equipoOriginal = this.equipos.data.find((e) => e.idEquipo === event.id);
    if (!equipoOriginal) return;

    const payload = {
      idEquipo: equipoOriginal.idEquipo,
      nombre: equipoOriginal.nombre,
      idGrupo: equipoOriginal.idGrupo,
      entrenador: equipoOriginal.entrenador,
      estado: event.data.estado,
      bandera: equipoOriginal.bandera,
    };

    this.equipoService.putEquipo(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.listEquipos();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogEditar.cerrarConError();
        this.dialogService.mostrar('Ocurrió un error al actualizar el equipo', 'error');
      },
    });
  }
}
