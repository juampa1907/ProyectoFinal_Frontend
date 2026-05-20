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
  private suscripcion!: Subscription;

  @Output() confirmarEliminar = new EventEmitter<number>();

  constructor(
    private dialogConfirmService: DialogConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.suscripcion = this.dialogConfirmService.abrir$.subscribe((id) => {
      this.idUsuario = id;
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  cancelar() {
    this.visible = false;
    this.loading = false;
  }

  eliminar() {
    this.loading = true;
    this.confirmarEliminar.emit(this.idUsuario);
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
