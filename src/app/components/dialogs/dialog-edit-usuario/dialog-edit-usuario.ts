import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { UsuarioEdicionAdministrador } from '../../../models/interface';

@Component({
  selector: 'app-dialog-edit-usuario',
  imports: [CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,],
  templateUrl: './dialog-edit-usuario.html',
  styleUrl: './dialog-edit-usuario.css',
})
export class DialogEditUsuario {

  visible = false;
  loading = false;
  idUsuario!: number;

  @Output() usuarioEditado = new EventEmitter<{ id: number; data: UsuarioEdicionAdministrador }>();

  roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Usuario', value: 2 },
    { label: 'Operador', value: 3 },
  ];

  estados = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      idRol:  [null, Validators.required],
      estado: [null, Validators.required],
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  esAdministrador: boolean = false;

  abrir(id: number, rolActual: number, estadoActual: string): void {
    this.idUsuario = id;
    this.esAdministrador = rolActual === 1;
    this.form.setValue({ idRol: rolActual, estado: estadoActual });
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
    const payload: UsuarioEdicionAdministrador = {
      idRol:  this.esAdministrador ? 1 : this.form.value.idRol,
      estado: this.form.value.estado,
    };
 
    this.usuarioEditado.emit({ id: this.idUsuario, data: payload });
  }

  cerrarConExito(): void {
    this.loading = false;
    this.visible = false;
    this.form.reset();
    this.cdr.detectChanges();
  }

  cerrarConError(): void {
    this.loading = false;
    this.cdr.detectChanges;
  }
}
