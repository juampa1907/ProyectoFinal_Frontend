import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from '../../../service/dialog-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-alert',
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog [(visible)]="visible" [modal]="true" [closable]="false" [style]="{ width: '350px' }">
      <ng-template pTemplate="header">
        <span [class]="tipo === 'error' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
          {{ tipo === 'error' ? '⚠️ Error' : '✅ Éxito' }}
        </span>
      </ng-template>

      <p class="text-center mt-2">{{ mensaje }}</p>

      <ng-template pTemplate="footer">
        <p-button
          label="Aceptar"
          (onClick)="cerrar()"
          [severity]="tipo === 'error' ? 'danger' : 'success'"
        >
        </p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class DialogAlert implements OnInit, OnDestroy {
  visible = false;
  mensaje = '';
  tipo: 'error' | 'exito' = 'error';
  private suscripcion!: Subscription;

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.suscripcion = this.dialogService.dialog$.subscribe((data) => {
      this.mensaje = data.mensaje;
      this.tipo = data.tipo;
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  cerrar() {
    this.visible = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }
}
