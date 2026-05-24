import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Equipo } from '../../models/equipo';
import { EquipoService } from '../../service/equipo-service';
import { CommonModule } from '@angular/common';
import { GrupoService } from '../../service/grupo-service';
import { Grupo } from '../../models/grupo';

@Component({
  selector: 'app-grupo-table-readonly',
  imports: [CommonModule],
  templateUrl: './grupo-table-readonly.html',
  styleUrl: './grupo-table-readonly.css',
})
export class GrupoTableReadOnly implements OnInit {
  gruposData: Grupo[] = [];
  equipos: Equipo[] = [];

  constructor(
    private equipoService: EquipoService,
    private grupoService: GrupoService,
    private cdr: ChangeDetectorRef,
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
      error: () => {},
    });
  }

  listGrupos(): void {
    this.grupoService.getGrupoList().subscribe({
      next: (data) => {
        this.gruposData = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  getEquiposPorGrupo(grupoId: string): Equipo[] {
    return this.equipos.filter((e) => this.getGrupoLetra(e.idGrupo) === grupoId);
  }

  getGrupoLetra(idGrupo: string | number): string {
    if (typeof idGrupo === 'string') return idGrupo;
    return String.fromCharCode(64 + idGrupo);
  }
}
