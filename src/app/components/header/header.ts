import { Component, inject, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  styles: [
    `
      :host ::ng-deep .header-btn {
        color: white !important;
        transition:
          background 0.2s ease,
          transform 0.2s ease;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
      }
      :host ::ng-deep .header-btn .mat-icon {
        color: white !important;
      }
      :host ::ng-deep .header-btn:hover {
        background: rgba(255, 255, 255, 0.2) !important;
        transform: scale(1.1);
      }
    `,
  ],
  template: `
    <mat-toolbar
      style="background-image: url('/fondo5.jpg'); background-position: center; display:flex;"
    >
      <button
        class="header-btn"
        mat-icon-button
        matTooltip="Menú"
        matTooltipPosition="below"
        (click)="onToggle.emit()"
        style="color:white;"
      >
        <div
          style="display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:20px;height:20px;"
        >
          <span
            style="display:block;height:2px;width:20px;background:white;border-radius:9999px;"
          ></span>
          <span
            style="display:block;height:2px;width:20px;background:white;border-radius:9999px;"
          ></span>
          <span
            style="display:block;height:2px;width:20px;background:white;border-radius:9999px;"
          ></span>
        </div>
      </button>
      <span style="flex:1"></span>
      <button
        mat-icon-button
        class="header-btn"
        matTooltip="Mi cuenta"
        matTooltipPosition="below"
        (click)="onAccount.emit()"
        style="color:white;"
      >
        <mat-icon style="color:white;">person</mat-icon>
      </button>
      <button
        mat-icon-button
        class="header-btn"
        matTooltip="Cerrar sesión"
        matTooltipPosition="below"
        (click)="logout()"
        style="color:white;"
      >
        <mat-icon style="color:white;">logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
})
export class Header {
  collapsed = input<boolean>(false);
  onToggle = output<void>();
  onAccount = output<void>();
  onLogout = output<void>();

  private router = inject(Router);
  logout() {
    sessionStorage.removeItem('usuarioLogueado');
    this.onLogout.emit();
    this.router.navigate(['/login']);
  }
}
