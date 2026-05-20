import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dialog-edit-jugador',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, SelectModule],
  templateUrl: './dialog-edit-jugador.html',
  styleUrl: './dialog-edit-jugador.css',
})
export class DialogEditJugador {
  visible = false;
  loading = false;
  idJugador!: number;

  @Output() jugadorEditado = new EventEmitter<{ id: number; data: any }>();

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
      estado: [null, Validators.required],
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  abrir(id: number, estadoActual: string): void {
    this.idJugador = id;
    this.form.setValue({ estado: estadoActual });
    this.cdr.detectChanges();
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
    const payload = {
      estado: this.form.value.estado,
    };

    this.jugadorEditado.emit({ id: this.idJugador, data: payload });
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
