import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from '../../service/dialog-service';

@Component({
  selector: 'app-dialog-alert',
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
     <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [closable]="false"
      [style]="{ width: '350px' }">

      <!-- Header -->
      <ng-template pTemplate="header">
        <span [class]="tipo === 'error' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
          {{ tipo === 'error' ? '⚠️ Error' : '✅ Éxito' }}
        </span>
      </ng-template>

      <!-- Mensaje -->
      <p class="text-center mt-2">{{ mensaje }}</p>

      <!-- Botón cerrar -->
      <ng-template pTemplate="footer">
        <p-button 
          label="Aceptar" 
          (onClick)="visible = false"
          [severity]="tipo === 'error' ? 'danger' : 'success'">
        </p-button>
      </ng-template>

    </p-dialog>
  `
})
export class DialogAlert implements OnInit{
  visible = false;
  mensaje = '';
  tipo: 'error' | 'exito' = 'error';

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.dialogService.dialog$.subscribe(({ mensaje, tipo }) => {
      this.mensaje = mensaje;
      this.tipo = tipo;
      this.visible = true;
    });
  }
}
