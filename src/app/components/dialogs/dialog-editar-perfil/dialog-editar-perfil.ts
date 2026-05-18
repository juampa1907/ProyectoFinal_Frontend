import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../../../service/usuario-service';
import { PerfilService } from '../../../service/perfil-service';
import { DialogService } from '../../../service/dialog-service';

export function conNumero(c: AbstractControl): ValidationErrors | null {
  return /\d/.test(c.value) ? { conNumero: true } : null;
}
export function conCaracter(c: AbstractControl): ValidationErrors | null {
  return /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(c.value) ? { conCaracter: true } : null;
}
export function conEspacio(c: AbstractControl): ValidationErrors | null {
  return /\s/.test(c.value) ? { conEspacio: true } : null;
}
export function sinNumero(c: AbstractControl): ValidationErrors | null {
  return /\d/.test(c.value) ? null : { sinNumero: true };
}
export function sinLetra(c: AbstractControl): ValidationErrors | null {
  return /[a-zA-Z]/.test(c.value) ? null : { sinLetra: true };
}
export function tieneEspacio(c: AbstractControl): ValidationErrors | null {
  return /\s/.test(c.value) ? { tieneEspacio: true } : null;
}
export function tieneMayuscula(c: AbstractControl): ValidationErrors | null {
  return /[A-Z]/.test(c.value) ? { tieneMayuscula: true } : null;
}

@Component({
  selector: 'app-dialog-editar-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './dialog-editar-perfil.html',
  styleUrl: './dialog-editar-perfil.css',
})
export class DialogEditarPerfil implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private perfilService = inject(PerfilService);
  private dialogService = inject(DialogService);

  @Output() perfilEditado = new EventEmitter<any>();

  visible = false;
  loading = signal(false);
  showPassword = signal(false);

  form!: FormGroup;
  private usuarioId!: number;
  private usuario!: any;

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    const raw = sessionStorage.getItem('usuarioLogueado');
    const usuario = raw ? JSON.parse(raw) : null;
    this.usuario = usuario;
    this.usuarioId = usuario?.id ?? usuario?.idUsuario;

    this.form = this.fb.group({
      nombreApellido: [
        usuario?.nombreApellido ?? '',
        [Validators.required, Validators.minLength(6), conNumero, conCaracter],
      ],
      username: [
        usuario?.username ?? '',
        [Validators.required, Validators.minLength(3), conEspacio, sinNumero, sinLetra],
      ],
      correo: [
        usuario?.correo ?? '',
        [Validators.required, Validators.email, tieneEspacio, tieneMayuscula],
      ],
    });
  }

  abrir(): void {
    this.cargarDatosUsuario();
    this.visible = true;
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  cancelar(): void {
    this.visible = false;
    this.showPassword.set(false);
    this.cargarDatosUsuario();
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);

    const payload: any = {
      idUsuario: this.usuarioId,
      username: this.form.value.username,
      nombreApellido: this.form.value.nombreApellido,
      correo: this.form.value.correo,
      password: this.usuario?.password,
    };

    if (this.showPassword() && this.form.value.password) {
      payload.password = this.form.value.password;
    }

    this.usuarioService.putUsuario(payload).subscribe({
      next: (response) => {
        sessionStorage.setItem('usuarioLogueado', JSON.stringify(response));
        this.perfilEditado.emit(response);
        this.perfilService.notificarActualizacion();
        this.dialogService.mostrar('Se ha actualizado exitosamente', 'exito');
        this.loading.set(false);
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        const mensaje = error?.error?.message || 'Error del servidor, intente más tarde';
        this.dialogService.mostrar(mensaje, 'error');
        this.loading.set(false);
      }
    });
  }
}