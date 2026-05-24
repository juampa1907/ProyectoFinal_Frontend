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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { DialogCodigoVerificacion } from '../dialogs/dialog-codigo-verificacion/dialog-codigo-verificacion';
import { UsuarioService } from '../../service/usuario-service';
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

@Component({
  selector: 'app-password-recovery',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RippleModule,
    RouterModule,
    ReactiveFormsModule,
    DialogAlert,
    DialogCodigoVerificacion,
  ],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css',
})
export class PasswordRecovery {
  @ViewChild(DialogCodigoVerificacion) codigoDialog!: DialogCodigoVerificacion;

  step: 1 | 2 = 1;
  formStep1!: FormGroup;
  formStep2!: FormGroup;
  username: string = '';
  correoDestino: string = '';
  loading = signal(false);

  isInvalid(campo: string): boolean {
    const control = this.formStep1.get(campo) ?? this.formStep2.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  hasError(campo: string, error: string): boolean {
    const control = this.formStep1.get(campo) ?? this.formStep2.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
  ) {
    this.formStep1 = this.fb.group({
      username: ['', [Validators.required]],
    });

    this.formStep2 = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(8), passwordSegura],
        ],
        confirmarPassword: ['', [Validators.required]],
      },
      { validators: passwordsIguales },
    );

    this.route.queryParams.subscribe((params) => {
      if (params['step'] === '2' && params['username']) {
        this.step = 2;
        this.username = params['username'];
      }
    });
  }

  solicitarCodigo(): void {
    if (this.formStep1.invalid) {
      this.formStep1.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.username = this.formStep1.value.username;

    this.usuarioService.solicitarCambioClave(this.username).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.correoDestino = res.correoMask ?? res.correo;
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
  }

  onCodigoVerificado(codigo: string): void {
    this.usuarioService.validarCodigoCambio(this.username, codigo).subscribe({
      next: () => {
        this.codigoDialog.cerrar();
        this.step = 2;
      },
      error: () => {
        this.codigoDialog.mostrarError();
        this.dialogService.mostrar('Código de verificación inválido o expirado', 'error');
      },
    });
  }

  cambiarPassword(): void {
    if (this.formStep2.invalid) {
      this.formStep2.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.usuarioService.cambiarClave(this.username, this.formStep2.value.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogService.mostrar('Contraseña cambiada exitosamente', 'exito');
        setTimeout(() => {
          if (window.opener) {
            window.opener.location.href = '/login';
          }
          window.close();
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.dialogService.mostrar(
          err.error?.message ?? 'Error del servidor, inténtelo más tarde',
          'error',
        );
      },
    });
  }
}
