import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavAdmin } from './components/sidenav-admin/sidenav-admin';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavAdmin],
  template: `<app-sidenav-admin/>`,
})
export class App {
}
