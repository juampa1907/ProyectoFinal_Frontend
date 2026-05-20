import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Equipo } from '../../models/equipo';
import { EquipoService } from '../../service/equipo-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DialogEditGrupo } from '../dialogs/dialog-edit-grupo/dialog-edit-grupo';
import { GrupoService } from '../../service/grupo-service';
import { DialogService } from '../../service/dialog-service';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { Grupo } from '../../models/grupo';

@Component({
  selector: 'app-grupo-table',
  imports: [CommonModule, MatIconModule, DialogEditGrupo, DialogAlert],
  templateUrl: './grupo-table.html',
  styleUrl: './grupo-table.css',
})
export class GrupoTable implements OnInit {
  gruposData: Grupo[] = [];
  equipos: Equipo[] = [];

  constructor(
    private equipoService: EquipoService,
    private grupoService: GrupoService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.listEquipos();
    this.listGrupos();
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

  listGrupos(): void {
    this.grupoService.getGrupoList().subscribe({
      next: (data) => {
        this.gruposData = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
      },
    });
  }

  getEquiposPorGrupo(grupoId: string): Equipo[] {
    return this.equipos.filter((e) => this.getGrupoLetra(e.idGrupo) === grupoId);
  }

  getGrupoLetra(idGrupo: string | number): string {
    if (typeof idGrupo === 'string') return idGrupo;
    return String.fromCharCode(64 + idGrupo);
  }

  @ViewChild('dialogEditar') dialogEditar!: DialogEditGrupo;

  onGrupoEditado(event: { id: string; data: any }): void {
    const grupoOriginal = this.gruposData.find((g) => g.idGrupo === event.id);
    if (!grupoOriginal) {
      this.dialogService.mostrar('Grupo no encontrado', 'error');
      return;
    }

    const payload = {
      idGrupo: grupoOriginal.idGrupo,
      descripcion: grupoOriginal.descripcion,
      estado: event.data.estado,
    };

    this.grupoService.putGrupo(payload).subscribe({
      next: (response) => {
        // debug removed
        this.dialogEditar.cerrarConExito();
        this.dialogService.mostrar('Grupo actualizado correctamente', 'exito');
        this.listGrupos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error handled silently
        // error handled silently
        // error handled silently
        this.dialogEditar.cerrarConError();
        this.dialogService.mostrar(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : `Error ${err.status}: ${err.error?.message ?? 'Ocurrió un error al actualizar el grupo'}`,
          'error',
        );
      },
    });
  }
}
