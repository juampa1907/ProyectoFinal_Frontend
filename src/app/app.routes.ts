import { Routes } from '@angular/router';
import { UsuarioLogin } from './components/usuario-login/usuario-login';
import { UsuarioRegistro } from './components/usuario-registro/usuario-registro';
import { Auditoria } from './components/auditoria/auditoria';
import { UsuarioTable } from './components/usuario-table/usuario-table';
import { EquipoTable } from './components/equipo-table/equipo-table';
import { GrupoTable } from './components/grupo-table/grupo-table';
import { JugadorTable } from './components/jugador-table/jugador-table';
import { PartidoTable } from './components/partido-table/partido-table';
import { EstadioTable } from './components/estadio-table/estadio-table';
import { SidenavAdmin } from './components/sidenav-admin/sidenav-admin';
import { SidenavOperario } from './components/sidenav-operario/sidenav-operario';
import { SidenavUsuario } from './components/sidenav-usuario/sidenav-usuario';
import { PasswordRecovery } from './components/password-recovery/password-recovery';
import { EquipoTableReadOnly } from './components/equipo-table-readonly/equipo-table-readonly';
import { GrupoTableReadOnly } from './components/grupo-table-readonly/grupo-table-readonly';
import { EstadioTableReadOnly } from './components/estadio-table-readonly/estadio-table-readonly';
import { JugadorTableReadOnly } from './components/jugador-table-readonly/jugador-table-readonly';
import { PartidoTableReadOnly } from './components/partido-table-readonly/partido-table-readonly';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UsuarioLogin },
  { path: 'registro', component: UsuarioRegistro },
  { path: 'olvido-password', component: PasswordRecovery },
  {
    path: 'admin',
    component: SidenavAdmin,
    children: [
      { path: 'dashboard', component: Auditoria },
      { path: 'usuarios', component: UsuarioTable },
      { path: 'equipos', component: EquipoTableReadOnly },
      { path: 'grupos', component: GrupoTableReadOnly },
      { path: 'estadios', component: EstadioTableReadOnly },
      { path: 'jugadores', component: JugadorTableReadOnly },
      { path: 'partidos', component: PartidoTableReadOnly },
    ],
  },
  {
    path: 'operario',
    component: SidenavOperario,
    children: [
      { path: 'equipos', component: EquipoTable },
      { path: 'grupos', component: GrupoTable },
      { path: 'estadios', component: EstadioTable },
      { path: 'jugadores', component: JugadorTable },
      { path: 'partidos', component: PartidoTable },
    ],
  },
  {
    path: 'usuario',
    component: SidenavUsuario,
    children: [
      { path: 'equipos', component: EquipoTableReadOnly },
      { path: 'grupos', component: GrupoTableReadOnly },
      { path: 'estadios', component: EstadioTableReadOnly },
      { path: 'jugadores', component: JugadorTableReadOnly },
      { path: 'partidos', component: PartidoTableReadOnly },
    ],
  },
];
