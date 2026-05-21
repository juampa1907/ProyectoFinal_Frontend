import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Estadio } from '../../models/estadio';
import { EstadioService } from '../../service/estadio-service';
import { DashboardDataService } from '../../service/dashboard-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateEstadio } from '../dialogs/create-estadio/create-estadio';
import { DialogEditEstadio } from '../dialogs/dialog-edit-estadio/dialog-edit-estadio';
import { DialogConfirmEliminar } from '../dialogs/dialog-confirm-eliminar/dialog-confirm-eliminar';
import { DialogConfirmService } from '../../service/dialog-confirm-service';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';

@Component({
  selector: 'app-estadio-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    CreateEstadio,
    DialogEditEstadio,
    DialogConfirmEliminar,
    DialogAlert,
  ],
  templateUrl: './estadio-table.html',
  styleUrl: './estadio-table.css',
})
export class EstadioTable implements OnInit {
  estadios = new MatTableDataSource<Estadio>([]);
  displayedColumns: string[] = [
    'idEstadio',
    'descripcion',
    'estado',
    'editar',
    'eliminar',
  ];

  constructor(
    private estadioService: EstadioService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    public dialogConfirmService: DialogConfirmService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.estadios.filterPredicate = (data: Estadio, filter: string) => {
      const searchText = filter.toLowerCase();
      return (
        data.idEstadio.toString().includes(searchText) ||
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
      case 'A':
        return 'ACTIVO';
      case 'I':
        return 'INACTIVO';
      default:
        return 'desconocido';
    }
  }

  @ViewChild('dialogCrear') dialogCrear!: CreateEstadio;

  onEstadioCreado(payload: any): void {
    this.estadioService.saveEstadio(payload).subscribe({
      next: () => {
        this.dialogCrear.cerrarConExito();
        this.listEstadios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogCrear.cerrarConError();
      },
    });
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditEstadio;

  onEstadioEditado(event: { id: number; data: any }): void {
    const estadioOriginal = this.estadios.data.find((e) => e.idEstadio === event.id);
    if (!estadioOriginal) return;

    const payload = {
      idEstadio: estadioOriginal.idEstadio,
      descripcion: event.data.descripcion,
      estado: event.data.estado,
    };

    this.estadioService.putEstadio(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.listEstadios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogEditar.cerrarConError();
      },
    });
  }

  @ViewChild('dialogConfirm') dialogConfirm!: DialogConfirmEliminar;

  onEliminarEstadio(id: number): void {
    this.estadioService.deleteEstadio(id).subscribe({
      next: () => {
        this.dialogConfirm.cerrarConExito();
        this.dialogService.mostrar('Estadio eliminado correctamente', 'exito');
        this.listEstadios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogConfirm.cerrarConError();
        this.dialogService.mostrar('Ocurrió un error al eliminar el estadio', 'error');
      },
    });
  }

  onAbrirEliminar(estadio: Estadio): void {
    this.dialogConfirmService.abrir(estadio.idEstadio, 'ESTADIO');
  }
}
