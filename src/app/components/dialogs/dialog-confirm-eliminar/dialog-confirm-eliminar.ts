import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { DialogConfirmService } from '../../../service/dialog-confirm-service';

@Component({
  selector: 'app-dialog-confirm-eliminar',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './dialog-confirm-eliminar.html',
  styleUrl: './dialog-confirm-eliminar.css',
})
export class DialogConfirmEliminar implements OnInit, OnDestroy {
  visible = false;
  loading = false;
  idUsuario!: number;
  entidad: string = 'REGISTRO';
  private suscripcion!: Subscription;

  @Output() confirmarEliminar = new EventEmitter<number>();

  constructor(
    private dialogConfirmService: DialogConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.suscripcion = this.dialogConfirmService.abrir$.subscribe((data) => {
      this.idUsuario = data.id;
      this.entidad = data.entidad ?? 'REGISTRO';
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  cancelar() {
    this.visible = false;
    this.loading = false;
    this.cdr.detectChanges();
  }

  eliminar() {
    this.loading = true;
    this.confirmarEliminar.emit(this.idUsuario);
    this.cdr.detectChanges();
  }

  cerrarConExito() {
    this.loading = false;
    this.visible = false;
    this.cdr.detectChanges();
  }

  cerrarConError() {
    this.loading = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }
}
