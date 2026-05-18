import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { UsuarioService } from '../../service/usuario-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAlert } from '../dialogs/dialog-alert/dialog-alert';
import { DialogService } from '../../service/dialog-service';


@Component({
  selector: 'app-usuario-login',
  imports: [MatFormFieldModule, CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DialogAlert],
  templateUrl: './usuario-login.html',
  styleUrl: './usuario-login.css',
})
export class UsuarioLogin {
    
    loginForm! : FormGroup;
    errorMessage : string = '';
    loading : boolean = false;

    constructor(private fb : FormBuilder, private usuarioService: UsuarioService, private router: Router, private dialogService: DialogService){
       this.loginForm = this.fb.group({
        username: ['',[Validators.required]],
        password: ['',[Validators.required, Validators.minLength(6)]]
      });
    }

    onSubmit(): void{
      if(this.loginForm.invalid){
        this.loginForm.markAllAsTouched();
        const usernameVacio = this.loginForm.get('username')?.hasError('required');
        const passwordVacio = this.loginForm.get('password')?.hasError('required');

       if (usernameVacio && passwordVacio) {
          this.dialogService.mostrar('El usuario y la contraseña son requeridos', 'error');
        } else if (usernameVacio) {
         this.dialogService.mostrar('El campo usuario es requerido', 'error');
        } else if (passwordVacio) {
          this.dialogService.mostrar('El campo contraseña es requerido', 'error');
        }
        return;
      }

      this.loading = true;

      this.usuarioService.loginUsuario(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          sessionStorage.setItem('usuarioLogueado', JSON.stringify(response));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false
          const mensaje = err.status === 401 ? 'Credenciales incorrectas' : 'Error del servidor, intentelo más tarde';
          this.dialogService.mostrar(mensaje, 'error'); 
        }
      });
      
    }
}
