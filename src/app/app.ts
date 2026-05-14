import { Component, computed, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { CustomeSidenav } from './components/custom-sidenav/custom-sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, Header, CustomeSidenav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  collapsed = signal(false);
  width = computed(() => this.collapsed() ? 64 : 250);
}
