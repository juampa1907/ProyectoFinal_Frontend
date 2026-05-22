import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { DialogCodigoVerificacion } from '../dialogs/dialog-codigo-verificacion/dialog-codigo-verificacion';
import { UsuarioService } from '../../service/usuario-service';
import { UsuarioCreacion } from '../../models/interface';
import { DialogService } from '../../service/dialog-service';

function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmar = control.get('confirmarPassword')?.value;
  if (password && confirmar && password !== confirmar) {
    return { noCoinciden: true };
  }
  return null;
}

function passwordSegura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneMinuscula = /[a-z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);
  const tieneEspacio = /\s/.test(valor);

  if (!tieneMayuscula && !tieneMinuscula && !tieneNumero && tieneEspacio) {
    return { sinMayuscula: true, sinMinuscula: true, sinNumero: true, conEspacio: true };
  } else if (!tieneMayuscula) {
    return { sinMayuscula: true };
  } else if (!tieneMinuscula) {
    return { sinMinuscula: true };
  } else if (!tieneNumero) {
    return { sinNumero: true };
  } else if (tieneEspacio) {
    return { conEspacio: true };
  }
  return null;
}

function usuarioValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneEspacio = /\s/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);
  const tieneLetra = /[a-zA-Z]/.test(valor);

  if (tieneEspacio && !tieneNumero && !tieneLetra) {
    return { conEspacio: true, sinNumero: true, sinLetra: true };
  } else if (tieneEspacio) {
    return { conEspacio: true };
  } else if (!tieneNumero) {
    return { sinNumero: true };
  } else if (!tieneLetra) {
    return { sinLetra: true };
  }

  return null;
}

function nombreApellidoValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const tieneNumero = /[0-9]/.test(valor);
  const tieneCaracteresEspeciales = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(valor);

  if (tieneNumero && tieneCaracteresEspeciales) {
    return { conNumero: true, conCaracter: true };
  } else if (tieneNumero) {
    return { conNumero: true };
  } else if (tieneCaracteresEspeciales) {
    return { conCaracter: true };
  }

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
  selector: 'app-usuario-registro',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    ReactiveFormsModule,
    DialogAlert,
    DialogCodigoVerificacion,
  ],
  templateUrl: './usuario-registro.html',
  styleUrl: './usuario-registro.css',
})
export class UsuarioRegistro {
  @ViewChild(DialogCodigoVerificacion) codigoDialog!: DialogCodigoVerificacion;

  registroForm!: FormGroup;
  loading = signal(false);

  isInvalid(campo: string): boolean {
    const control = this.registroForm.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  hasError(campo: string, error: string): boolean {
    const control = this.registroForm.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private dialogService: DialogService,
  ) {
    this.registroForm = this.fb.group(
      {
        nombreApellido: ['', [Validators.required, Validators.minLength(6), nombreApellidoValido]],
        username: ['', [Validators.required, Validators.minLength(3), usuarioValido]],
        correo: ['', [Validators.required, Validators.email, correoValido]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(8), passwordSegura],
        ],
        confirmarPassword: ['', [Validators.required]],
      },
      { validators: passwordsIguales },
    );
  }

  private get datosFormulario(): UsuarioCreacion {
    return {
      username: this.registroForm.value.username,
      password: this.registroForm.value.password,
      correo: this.registroForm.value.correo,
      nombreApellido: this.registroForm.value.nombreApellido,
      idRol: 2,
    };
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.usuarioService.enviarCodigoVerificacion(this.datosFormulario).subscribe({
        next: () => {
          this.loading.set(false);
          this.codigoDialog.abrir();
        },
        error: (err) => {
          this.loading.set(false);
          this.dialogService.mostrar(
            err.error?.message ?? 'Error del servidor, inténtelo más tarde',
            'error',
          );
        },
      });
    });
  }

  onCodigoVerificado(codigo: string): void {
    setTimeout(() => {
      this.usuarioService.registrarUsuario(this.datosFormulario, codigo).subscribe({
        next: () => {
          this.codigoDialog.cerrar();
          this.dialogService.mostrar('¡Usuario creado exitosamente!', 'exito');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.codigoDialog.mostrarError();
          this.dialogService.mostrar('Codigo de verificación inválido o expirado', 'error');
        },
      });
    });
  }
}
