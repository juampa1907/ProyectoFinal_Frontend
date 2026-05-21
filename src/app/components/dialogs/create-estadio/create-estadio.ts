import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-create-estadio',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './create-estadio.html',
  styleUrl: './create-estadio.css',
})
export class CreateEstadio {
  visible = false;
  loading = false;

  @Output() estadioCreado = new EventEmitter<any>();

  estados = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      estado: [null, Validators.required],
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  hasError(campo: string, error: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }

  abrir(): void {
    this.form.reset();
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
    this.estadioCreado.emit(this.form.value);
  }

  cerrarConExito(): void {
    this.loading = false;
    this.visible = false;
    this.form.reset();
  }

  cerrarConError(): void {
    this.loading = false;
  }
}
