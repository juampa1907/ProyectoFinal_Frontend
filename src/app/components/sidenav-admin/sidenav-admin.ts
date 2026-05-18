import { Component, computed, input, signal, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header } from '../header/header';
import { MenuItem } from '../../models/interface';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { DialogEditarPerfil } from '../dialogs/dialog-editar-perfil/dialog-editar-perfil';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';

@Component({
  selector: 'app-sidenav-admin',
  styles: [`
     :host ::ng-deep .mat-drawer-inner-container {
    overflow: hidden !important;
    scrollbar-width: none !important;
  }

  :host ::ng-deep .mat-drawer-inner-container::-webkit-scrollbar {
    display: none !important;
  }
  `],
  imports: [MatSidenavModule, Header, MatIconModule, RouterModule, RouterLink, RouterLinkActive, DialogEditarPerfil, DialogAlert],
  template: `
    <mat-sidenav-container class="h-screen" style="background-image: url('/fondo5.jpg');">
    <mat-sidenav class="!rounded-none !overflow-hidden" style="background-image: url('/fondo5.jpg');" [style.width.px]="width()" opened mode="side">

        <div class="transition-[width] duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-hidden"
            [style.width.px]="width()">

            <div class="w-full mb-1">
                <img [src]="collapsed()? '/mundial_2026.png' : '/weare26.jpg'"  [alt]="collapsed() ? 'Logo' : 'MyApp'"  class=" w-full h-36 object-cover transition-all duration-500">
            </div>

            <ul class="p-2 flex flex-col w-full gap-1 mt-4">
                @for (item of items(); track item.label) {
                <li>
                    <a class="hover:bg-[#b8860b] w-full p-2 flex items-center gap-2 rounded-md transition-all duration-300 text-white cursor-pointer"
                        [routerLink]="item.path"
                        routerLinkActive="bg-[#b8860b]"
                        [class.justify-center]="collapsed()">
                        <mat-icon class="!text-[28px] !size-7 shrink-0">{{ item.icon }}</mat-icon>
                        <span class="overflow-hidden whitespace-nowrap transition-all duration-500"
                            [class.w-0]="collapsed()" [class.opacity-0]="collapsed()" [class.w-full]="!collapsed()"
                            [class.opacity-100]="!collapsed()">
                            {{ item.label }}
                        </span>
                    </a>
                </li>
                }
            </ul>

        </div>
    </mat-sidenav>
    <mat-sidenav-content [style.margin-left.px]="width()"
        class="transition-[margin] duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]">
        <app-header [collapsed]="collapsed()" (onToggle)="collapsed.set(!collapsed())" (onAccount)="abrirEditarPerfil()" />
        <router-outlet/>
    </mat-sidenav-content>
</mat-sidenav-container>

<app-dialog-editar-perfil #dialogEditarPerfil (perfilEditado)="onPerfilEditado($event)" />
<app-dialog-alert />
  `,
})
export class SidenavAdmin {
  @ViewChild('dialogEditarPerfil') dialogEditarPerfil!: DialogEditarPerfil;

  items = signal<MenuItem[]>([
    { path: '/dashboard', icon: 'assignment', label: 'Auditoria' },
    { path: '/equipos', icon: 'shield', label: 'Equipos' },
    { path: '/estadios', icon: 'stadium', label: 'Estadios' },
    { path: '/grupos', icon: 'emoji_events', label: 'Grupos' },
    { path: '/jugadores', icon: 'sports_soccer', label: 'Jugadores' },
    { path: '/params', icon: 'tune', label: 'Parametros' },
    { path: '/partidos', icon: 'sports', label: 'Partidos' },
    { path: '/roles', icon: 'manage_accounts', label: 'Roles' },
    { path: '/usuarios', icon: 'group', label: 'Usuarios' }
  ])

  collapsed = signal(false)
  width = computed(() => (this.collapsed() ? 100 : 250));

  abrirEditarPerfil(): void {
    if (this.dialogEditarPerfil) {
      this.dialogEditarPerfil.abrir();
    }
  }

  onPerfilEditado(usuario: any): void {
    console.log('Perfil actualizado:', usuario);
  }
}