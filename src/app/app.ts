import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavAdmin } from './components/sidenav-admin/sidenav-admin';
import { UsuarioLogin } from "./components/usuario-login/usuario-login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
})
export class App {
}
