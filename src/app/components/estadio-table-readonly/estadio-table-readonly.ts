import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Estadio } from '../../models/estadio';
import { EstadioService } from '../../service/estadio-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-estadio-table-readonly',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './estadio-table-readonly.html',
  styleUrl: './estadio-table-readonly.css',
})
export class EstadioTableReadOnly implements OnInit {
  estadios = new MatTableDataSource<Estadio>([]);
  displayedColumns: string[] = ['descripcion', 'estado'];

  constructor(
    private estadioService: EstadioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.estadios.filterPredicate = (data: Estadio, filter: string) => {
      const searchText = filter.toLowerCase();
      return (
        data.descripcion.toLowerCase().includes(searchText) ||
        data.estado.toLowerCase().includes(searchText)
      );
    };
    this.listEstadios();
  }

  listEstadios(): void {
    this.estadioService.getEstadioList().subscribe({
      next: (data) => {
        this.estadios.data = data;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.estadios.filter = value.trim().toLowerCase();
  }

  getEstadoNombre(estado: string): string {
    switch (estado) {
      case 'A': return 'ACTIVO';
      case 'I': return 'INACTIVO';
      default: return 'desconocido';
    }
  }
}
