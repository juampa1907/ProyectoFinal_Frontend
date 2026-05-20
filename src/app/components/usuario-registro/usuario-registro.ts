import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  ],
  templateUrl: './usuario-registro.html',
  styleUrl: './usuario-registro.css',
})
export class UsuarioRegistro {
  registroForm!: FormGroup;
  loading: boolean = false;

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

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();

      const f = this.registroForm;

      if (f.get('nombreApellido')?.hasError('required')) {
        this.dialogService.mostrar('El nombre y apellido es requerido', 'error');
      } else if (f.get('nombreApellido')?.hasError('conNumero')) {
        this.dialogService.mostrar('El campo nombre y apellido no puede tener números', 'error');
      } else if (f.get('nombreApellido')?.hasError('conCaracter')) {
        this.dialogService.mostrar(
          'El campo nombre y apellido no puede tener caracteres especiales',
          'error',
        );
      } else if (f.get('nombreApellido')?.hasError('minlength')) {
        this.dialogService.mostrar('El nombre debe tener al menos 6 caracteres', 'error');
      } else if (f.get('username')?.hasError('required')) {
        this.dialogService.mostrar('El usuario es requerido', 'error');
      } else if (f.get('username')?.hasError('minlength')) {
        this.dialogService.mostrar('El usuario debe tener al menos 3 caracteres', 'error');
      } else if (f.get('username')?.hasError('sinNumero')) {
        this.dialogService.mostrar('El usuario debe tener al menos 1 número', 'error');
      } else if (f.get('username')?.hasError('sinLetra')) {
        this.dialogService.mostrar('El usuario debe tener al menos 1 letra', 'error');
      } else if (f.get('username')?.hasError('conEspacio')) {
        this.dialogService.mostrar('El usuario no puede tener espacios', 'error');
      } else if (f.get('correo')?.hasError('required')) {
        this.dialogService.mostrar('El correo electronico es requerido', 'error');
      } else if (f.get('correo')?.hasError('email')) {
        this.dialogService.mostrar('Introduzca un formato de correo valido', 'error');
      } else if (f.get('correo')?.hasError('conEspacio')) {
        this.dialogService.mostrar('Introduzca un formato de correo valido', 'error');
      } else if (f.get('correo')?.hasError('conMayuscula')) {
        this.dialogService.mostrar('Introduzca un formato de correo valido', 'error');
      } else if (f.get('password')?.hasError('required')) {
        this.dialogService.mostrar('La contraseña es requerida', 'error');
      } else if (f.get('password')?.hasError('minlength')) {
        this.dialogService.mostrar('La contraseña debe tener al menos 6 caracteres', 'error');
      } else if (f.get('password')?.hasError('maxlength')) {
        this.dialogService.mostrar('La contraseña debe tener por mucho 8 caracteres', 'error');
      } else if (f.get('password')?.hasError('sinMayuscula')) {
        this.dialogService.mostrar(
          'La contraseña debe tener al menos una letra mayúscula',
          'error',
        );
      } else if (f.get('password')?.hasError('sinMinuscula')) {
        this.dialogService.mostrar(
          'La contraseña debe tener al menos una letra minúscula',
          'error',
        );
      } else if (f.get('password')?.hasError('sinNumero')) {
        this.dialogService.mostrar('La contraseña debe tener al menos un numero', 'error');
      } else if (f.get('password')?.hasError('conEspacio')) {
        this.dialogService.mostrar('La contraseña no debe tener espacios', 'error');
      } else if (f.get('confirmarPassword')?.hasError('required')) {
        this.dialogService.mostrar('Debes confirmar tu contraseña', 'error');
      } else if (f.hasError('noCoinciden')) {
        this.dialogService.mostrar('Las contraseñas no coinciden', 'error');
      }
      return;
    }

    this.loading = true;

    const nuevoUsuario = {
      username: this.registroForm.value.username,
      password: this.registroForm.value.password,
      correo: this.registroForm.value.correo,
      nombreApellido: this.registroForm.value.nombreApellido,
      idRol: 2,
    };

    this.usuarioService.saveUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.loading = false;
        this.dialogService.mostrar('¡Usuario creado exitosamente!', 'exito');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        const mensaje =
          err.status === 409
            ? (err.error?.message ?? 'El nombre de usuario ya está en uso')
            : 'Error del servidor, inténtelo más tarde';
        this.dialogService.mostrar(mensaje, 'error');
      },
    });
  }
}
