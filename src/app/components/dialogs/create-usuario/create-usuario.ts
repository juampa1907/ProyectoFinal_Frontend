import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';

function passwordSegura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneMinuscula = /[a-z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);
  const tieneEspacio = /\s/.test(valor);

  if (!tieneMayuscula) return { sinMayuscula: true };
  if (!tieneMinuscula) return { sinMinuscula: true };
  if (!tieneNumero) return { sinNumero: true };
  if (tieneEspacio) return { conEspacio: true };
  return null;
}

function usuarioValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneEspacio = /\s/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);
  const tieneLetra = /[a-zA-Z]/.test(valor);

  if (tieneEspacio) return { conEspacio: true };
  if (!tieneNumero) return { sinNumero: true };
  if (!tieneLetra) return { sinLetra: true };
  return null;
}

function nombreApellidoValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneNumero = /[0-9]/.test(valor);
  const tieneCaracteresEspeciales = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(valor);

  if (tieneNumero) return { conNumero: true };
  if (tieneCaracteresEspeciales) return { conCaracter: true };
  return null;
}

function correoValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneEspacio = /\s/.test(valor);
  const tieneMayuscula = /[A-Z]/.test(valor);

  if (tieneEspacio) return { conEspacio: true };
  if (tieneMayuscula) return { conMayuscula: true };
  return null;
}

@Component({
  selector: 'app-create-usuario',
  imports: [CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ],
  templateUrl: './create-usuario.html',
  styleUrl: './create-usuario.css',
})
export class CreateUsuario {
  visible = false;
  loading = false;

  @Output() usuarioCreado = new EventEmitter<any>();

  roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Operador', value: 3 },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        nombreApellido: ['', [Validators.required, Validators.minLength(6), nombreApellidoValido]],
        username: ['', [Validators.required, Validators.minLength(3), usuarioValido]],
        correo: ['', [Validators.required, Validators.email, correoValido]],
        idRol: [null, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8), passwordSegura]],
      },
    );
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
    const payload = {
      nombreApellido: this.form.value.nombreApellido,
      username: this.form.value.username,
      correo: this.form.value.correo,
      idRol: this.form.value.idRol,
      password: this.form.value.password,
    };

    this.usuarioCreado.emit(payload);
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
