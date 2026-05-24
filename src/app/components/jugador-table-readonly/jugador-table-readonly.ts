import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Jugador } from '../../models/jugador';
import { JugadorService } from '../../service/jugador-service';
import { EquipoService } from '../../service/equipo-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-jugador-table-readonly',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './jugador-table-readonly.html',
  styleUrl: './jugador-table-readonly.css',
})
export class JugadorTableReadOnly implements OnInit {
  jugadores = new MatTableDataSource<Jugador>([]);
  equipos: Equipo[] = [];
  displayedColumns: string[] = [
    'nombre',
    'idEquipo',
    'posicion',
    'numeroCamiseta',
    'fechaNacimiento',
    'estado',
  ];

  constructor(
    private jugadorService: JugadorService,
    private equipoService: EquipoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.jugadores.filterPredicate = (data: Jugador, filter: string) => {
      const equipoNombre = this.getNombreEquipo(data.idEquipo).toLowerCase();
      const searchText = filter.toLowerCase();
      return (
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
      case 'A': return 'ACTIVO';
      case 'I': return 'INACTIVO';
      default: return 'desconocido';
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
}
