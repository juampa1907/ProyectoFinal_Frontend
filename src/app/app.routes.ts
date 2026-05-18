import { Routes } from '@angular/router';
import { UsuarioLogin } from './components/usuario-login/usuario-login';
import { UsuarioRegistro } from './components/usuario-registro/usuario-registro';
import { Auditoria } from './components/auditoria/auditoria';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: UsuarioLogin },
    { path: 'registro', component: UsuarioRegistro},
    { path: 'dashboard', component: Auditoria}
];
