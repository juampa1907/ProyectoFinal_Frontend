import { Routes } from '@angular/router';
import { UsuarioLogin } from './components/usuario-login/usuario-login';
import { UsuarioRegistro } from './components/usuario-registro/usuario-registro';
import { Auditoria } from './components/auditoria/auditoria';
import { UsuarioTable } from './components/usuario-table/usuario-table';
import { SidenavAdmin } from './components/sidenav-admin/sidenav-admin';

export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: UsuarioLogin },
    { path: 'registro', component: UsuarioRegistro },
    {
        path: '',
        component: SidenavAdmin, 
        children: [
            { path: 'dashboard', component: Auditoria },
            { path: 'usuarios', component: UsuarioTable },
        ]
    }
];
