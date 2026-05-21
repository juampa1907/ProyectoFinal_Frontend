import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Auditoria as AuditoriaModel } from '../../models/auditoria';
import { AuditoriaService } from '../../service/auditoria-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogConfirmEliminar } from '../dialogs/dialog-confirm-eliminar/dialog-confirm-eliminar';
import { DialogConfirmService } from '../../service/dialog-confirm-service';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { DialogEditAuditoria } from '../dialogs/dialog-edit-auditoria/dialog-edit-auditoria';
import { Subscription } from 'rxjs';
import { DashboardDataService } from '../../service/dashboard-service';

@Component({
  selector: 'app-auditoria',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    DialogConfirmEliminar,
    DialogAlert,
    DialogEditAuditoria,
  ],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class Auditoria implements OnInit, OnDestroy {
  auditorias = new MatTableDataSource<AuditoriaModel>([]);
  displayedColumns: string[] = [
    'idLog',
    'idUsuario',
    'accion',
    'tablaAfectada',
    'idRegistroAfectado',
    'fechaHora',
    'ipCliente',
    'editar',
    'eliminar',
  ];

  totalUsuarios = 0;
  totalEquiposActivos = 0;
  faseActual = 'Sin definir';

  private suscripciones: Subscription[] = [];

  constructor(
    private auditoriaService: AuditoriaService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    public dialogConfirmService: DialogConfirmService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.listAuditorias();
    this.suscripciones.push(
      this.dashboardService.totalUsuarios$.subscribe((val) => (this.totalUsuarios = val)),
      this.dashboardService.totalEquiposActivos$.subscribe((val) => (this.totalEquiposActivos = val)),
      this.dashboardService.faseActual$.subscribe((val) => (this.faseActual = val)),
    );
    this.dashboardService.cargar();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach((s) => s.unsubscribe());
  }

  listAuditorias(): void {
    this.auditoriaService.getAuditoriaList().subscribe({
      next: (data) => {
        this.auditorias.data = data;
        this.cdr.detectChanges();
      },
    });
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}/${HH}:${min}`;
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditAuditoria;

  onAuditoriaEditado(event: { id: number; data: any }): void {
    const auditoriaOriginal = this.auditorias.data.find((a) => a.idLog === event.id);
    if (!auditoriaOriginal) return;

    const payload = {
      idLog: auditoriaOriginal.idLog,
      idUsuario: auditoriaOriginal.idUsuario,
      accion: event.data.accion,
      tablaAfectada: event.data.tablaAfectada,
      idRegistroAfectado: auditoriaOriginal.idRegistroAfectado,
      fechaHora: auditoriaOriginal.fechaHora,
      ipCliente: event.data.ipCliente,
    };

    this.auditoriaService.putAuditoria(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.listAuditorias();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogEditar.cerrarConError();
      },
    });
  }

  @ViewChild('dialogConfirm') dialogConfirm!: DialogConfirmEliminar;

  onEliminarAuditoria(id: number): void {
    this.auditoriaService.deleteAuditoria(id).subscribe({
      next: () => {
        this.dialogConfirm.cerrarConExito();
        this.dialogService.mostrar('Registro de auditoría eliminado correctamente', 'exito');
        this.listAuditorias();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogConfirm.cerrarConError();
        this.dialogService.mostrar('Ocurrió un error al eliminar el registro', 'error');
      },
    });
  }

  onAbrirEliminar(auditoria: AuditoriaModel): void {
    this.dialogConfirmService.abrir(auditoria.idLog, 'AUDITORIA');
  }
}
