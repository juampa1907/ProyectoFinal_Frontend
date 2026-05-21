import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../service/usuario-service';
import { DashboardDataService } from '../../service/dashboard-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateUsuario } from '../dialogs/create-usuario/create-usuario';
import { DialogEditUsuario } from '../dialogs/dialog-edit-usuario/dialog-edit-usuario';
import { DialogConfirmEliminar } from '../dialogs/dialog-confirm-eliminar/dialog-confirm-eliminar';
import { DialogConfirmService } from '../../service/dialog-confirm-service';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { DialogRoles } from '../dialogs/dialog-roles/dialog-roles';
import { PerfilService } from '../../service/perfil-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    CreateUsuario,
    DialogEditUsuario,
    DialogConfirmEliminar,
    DialogAlert,
    DialogRoles,
  ],
  templateUrl: './usuario-table.html',
  styleUrl: './usuario-table.css',
})
export class UsuarioTable implements OnInit, OnDestroy {
  usuarios = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = [
    'idUsuario',
    'username',
    'correo',
    'nombreApellido',
    'idRol',
    'estado',
    'fechaUltClave',
    'editar',
    'eliminar',
  ];
  private perfilSubscription!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef,
    public dialogConfirmService: DialogConfirmService,
    private dialogService: DialogService,
    private perfilService: PerfilService,
  ) {}

  ngOnInit(): void {
    this.usuarios.filterPredicate = (data: Usuario, filter: string) => {
      const rolNombre = this.getRolNombre(data.idRol).toLowerCase();
      const searchText = filter.toLowerCase();
      return (
        data.idUsuario.toString().includes(searchText) ||
        data.username.toLowerCase().includes(searchText) ||
        data.correo.toLowerCase().includes(searchText) ||
        data.nombreApellido.toLowerCase().includes(searchText) ||
        rolNombre.includes(searchText) ||
        data.estado.toLowerCase().includes(searchText) ||
        data.fechaUltClave.toLowerCase().includes(searchText)
      );
    };
    this.listUsuarios();
    this.perfilSubscription = this.perfilService.perfilActualizado$.subscribe(() => {
      this.listUsuarios();
      this.perfilService.reiniciarNotificacion();
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscription) {
      this.perfilSubscription.unsubscribe();
    }
  }

  listUsuarios(): void {
    this.usuarioService.getUsuarioList().subscribe({
      next: (data) => {
        this.usuarios.data = data;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.usuarios.filter = value.trim().toLowerCase();
  }

  getRolNombre(idRol: number): string {
    switch (idRol) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuario';
      case 3:
        return 'Operador';
      default:
        return 'Sin rol';
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

  @ViewChild('dialogCrear') dialogCrear!: CreateUsuario;
  @ViewChild('dialogRoles') dialogRoles!: DialogRoles;

  onUsuarioCreado(payload: any): void {
    this.usuarioService.saveUsuario(payload).subscribe({
      next: () => {
        this.dialogCrear.cerrarConExito();
        this.listUsuarios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogCrear.cerrarConError();
      },
    });
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditUsuario;

  onUsuarioEditado(event: { id: number; data: any }): void {
    const usuarioOriginal = this.usuarios.data.find((u) => u.idUsuario === event.id);
    if (!usuarioOriginal) return;

    const payload = {
      idUsuario: usuarioOriginal.idUsuario,
      username: usuarioOriginal.username,
      correo: usuarioOriginal.correo,
      nombreApellido: usuarioOriginal.nombreApellido,
      password: usuarioOriginal.password,
      idRol: event.data.idRol,
      estado: event.data.estado,
    };

    this.usuarioService.putUsuario(payload).subscribe({
      next: () => {
        this.dialogEditar.cerrarConExito();
        this.listUsuarios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogEditar.cerrarConError();
      },
    });
  }

  @ViewChild('dialogConfirm') dialogConfirm!: DialogConfirmEliminar;

  onEliminarUsuario(id: number): void {
    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.dialogConfirm.cerrarConExito();
        this.dialogService.mostrar('Usuario eliminado correctamente', 'exito');
        this.listUsuarios();
        this.dashboardService.cargar();
      },
      error: () => {
        this.dialogConfirm.cerrarConError();
        this.dialogService.mostrar('Ocurrió un error al eliminar el usuario', 'error');
      },
    });
  }

  onAbrirEliminar(usuario: Usuario): void {
    if (usuario.idRol === 1) {
      this.dialogService.mostrar('No se puede eliminar un usuario Administrador', 'error');
      return;
    }
    this.dialogConfirmService.abrir(usuario.idUsuario, 'USUARIO');
  }
}
