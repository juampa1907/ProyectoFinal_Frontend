import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Rol } from '../../../models/rol';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RolService } from '../../../service/rol-service';
import { MatIcon } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog-roles',
  imports: [CommonModule, MatTableModule, MatIcon, DialogModule, ButtonModule, MatTooltipModule],
  templateUrl: './dialog-roles.html',
  styleUrl: './dialog-roles.css',
})
export class DialogRoles {
  visible = false;
  roles = new MatTableDataSource<Rol>([]);
  displayedColumns: string[] = ['idRol', 'nombreRol', 'estado', 'editar'];

  @Output() rolActualizado = new EventEmitter<void>();

  constructor(
    private rolService: RolService,
    private cdr: ChangeDetectorRef,
  ) {}

  abrir(): void {
    this.visible = true;
    this.listRoles();
  }

  cerrar(): void {
    this.visible = false;
  }

  toggleEstado(rol: Rol): void {
    const nuevoEstado = rol.estado === 'A' ? 'I' : 'A';
    const rolActualizado = { ...rol, estado: nuevoEstado };

    this.rolService.putRol(rolActualizado).subscribe({
      next: () => {
        this.listRoles();
        this.rolActualizado.emit();
      },
      error: (err) => {
        // error handled silently
      },
    });
  }

  listRoles(): void {
    this.rolService.getRolList().subscribe({
      next: (data) => {
        this.roles.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
      },
    });
  }
}
