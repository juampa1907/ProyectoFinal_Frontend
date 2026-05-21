import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog-edit-auditoria',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './dialog-edit-auditoria.html',
  styleUrl: './dialog-edit-auditoria.css',
})
export class DialogEditAuditoria {
  visible = false;
  loading = false;
  idLog!: number;

  @Output() auditoriaEditado = new EventEmitter<{ id: number; data: any }>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      accion: ['', Validators.required],
      tablaAfectada: ['', Validators.required],
      ipCliente: ['', Validators.required],
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  abrir(auditoria: any): void {
    this.idLog = auditoria.idLog;
    this.form.setValue({
      accion: auditoria.accion,
      tablaAfectada: auditoria.tablaAfectada,
      ipCliente: auditoria.ipCliente,
    });
    this.visible = true;
  }

  cancelar(): void {
    this.form.reset();
    this.visible = false;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.auditoriaEditado.emit({ id: this.idLog, data: this.form.value });
  }

  cerrarConExito(): void {
    this.loading = false;
    this.visible = false;
    this.form.reset();
    this.cdr.detectChanges();
  }

  cerrarConError(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }
}
