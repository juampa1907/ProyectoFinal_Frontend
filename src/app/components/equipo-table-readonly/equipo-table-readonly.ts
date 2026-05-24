import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Equipo } from '../../models/equipo';
import { EquipoService } from '../../service/equipo-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-equipo-table-readonly',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './equipo-table-readonly.html',
  styleUrl: './equipo-table-readonly.css',
})
export class EquipoTableReadOnly implements OnInit {
  equipos = new MatTableDataSource<Equipo>([]);
  displayedColumns: string[] = ['bandera', 'nombre', 'idGrupo', 'entrenador', 'estado'];

  constructor(
    private equipoService: EquipoService,
    private cdr: ChangeDetectorRef,
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
      error: () => {},
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.equipos.filter = value.trim().toLowerCase();
  }

  getGrupoNombre(idGrupo: string): string {
    switch (idGrupo) {
      case 'A': return 'Grupo A';
      case 'B': return 'Grupo B';
      case 'C': return 'Grupo C';
      case 'D': return 'Grupo D';
      case 'E': return 'Grupo E';
      case 'F': return 'Grupo F';
      case 'G': return 'Grupo G';
      case 'H': return 'Grupo H';
      case 'I': return 'Grupo I';
      case 'J': return 'Grupo J';
      case 'K': return 'Grupo K';
      case 'L': return 'Grupo L';
      default: return `Grupo ${idGrupo}`;
    }
  }

  getEstadoNombre(estado: string): string {
    switch (estado) {
      case 'A': return 'ACTIVO';
      case 'I': return 'INACTIVO';
      default: return 'desconocido';
    }
  }
}
