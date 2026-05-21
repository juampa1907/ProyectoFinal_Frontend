import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dialog-edit-estadio',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './dialog-edit-estadio.html',
  styleUrl: './dialog-edit-estadio.css',
})
export class DialogEditEstadio {
  visible = false;
  loading = false;
  idEstadio!: number;

  @Output() estadioEditado = new EventEmitter<{ id: number; data: any }>();

  estados = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      estado: [null, Validators.required],
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  abrir(id: number, descripcion: string, estado: string): void {
    this.idEstadio = id;
    this.form.setValue({ descripcion, estado });
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
    this.estadioEditado.emit({ id: this.idEstadio, data: this.form.value });
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
