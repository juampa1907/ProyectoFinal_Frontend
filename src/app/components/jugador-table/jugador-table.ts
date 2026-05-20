import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Jugador } from '../../models/jugador';
import { JugadorService } from '../../service/jugador-service';
import { EquipoService } from '../../service/equipo-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogEditJugador } from '../dialogs/dialog-edit-jugador/dialog-edit-jugador';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-jugador-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    DialogEditJugador,
    DialogAlert,
  ],
  templateUrl: './jugador-table.html',
  styleUrl: './jugador-table.css',
})
export class JugadorTable implements OnInit {
  jugadores = new MatTableDataSource<Jugador>([]);
  equipos: Equipo[] = [];
  displayedColumns: string[] = [
    'idJugador',
    'nombre',
    'idEquipo',
    'posicion',
    'numeroCamiseta',
    'fechaNacimiento',
    'estado',
    'editar',
  ];

  constructor(
    private jugadorService: JugadorService,
    private equipoService: EquipoService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.jugadores.filterPredicate = (data: Jugador, filter: string) => {
      const equipoNombre = this.getNombreEquipo(data.idEquipo).toLowerCase();
      const searchText = filter.toLowerCase();
      return (
        data.idJugador.toString().includes(searchText) ||
        data.nombre.toLowerCase().includes(searchText) ||
        equipoNombre.includes(searchText) ||
        data.posicion.toLowerCase().includes(searchText) ||
        data.numeroCamiseta.toString().includes(searchText) ||
        data.fechaNacimiento.toLowerCase().includes(searchText) ||
        data.estado.toLowerCase().includes(searchText)
      );
    };
    this.listJugadores();
    this.listEquipos();
  }

  listJugadores(): void {
    this.jugadorService.getJugadorList().subscribe({
      next: (data) => {
        this.jugadores.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
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
        // error handled silently
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.jugadores.filter = value.trim().toLowerCase();
  }

  getBanderaEquipo(idEquipo: number): string {
    const equipo = this.equipos.find((e) => e.idEquipo === idEquipo);
    return equipo?.bandera ?? '';
  }

  getNombreEquipo(idEquipo: number): string {
    const equipo = this.equipos.find((e) => e.idEquipo === idEquipo);
    return equipo?.nombre ?? 'Sin equipo';
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

  formatFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditJugador;

  onJugadorEditado(event: { id: number; data: any }): void {
    const jugadorOriginal = this.jugadores.data.find((j) => j.idJugador === event.id);
    if (!jugadorOriginal) return;

    const payload = {
      idJugador: jugadorOriginal.idJugador,
      idEquipo: jugadorOriginal.idEquipo,
      nombre: jugadorOriginal.nombre,
      posicion: jugadorOriginal.posicion,
      numeroCamiseta: jugadorOriginal.numeroCamiseta,
      fechaNacimiento: jugadorOriginal.fechaNacimiento,
      estado: event.data.estado,
    };

    this.jugadorService.putJugador(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.dialogService.mostrar('Jugador actualizado correctamente', 'exito');
        this.listJugadores();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
        this.dialogEditar.cerrarConError();
        this.dialogService.mostrar(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : `Error ${err.status}: Ocurrió un error al actualizar el jugador`,
          'error',
        );
      },
    });
  }
}
