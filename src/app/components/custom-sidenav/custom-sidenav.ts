import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface MenuItem{
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-custom-sidenav',
  imports: [MatListModule, MatIconModule],
  template:`
  <div class="p-2">
    <mat-nav-list>
      @for (item of items(); track item.label) {
        <a mat-list-item>
          <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
          <span matListItemTitle>{{item.label}}</span>
        </a>
      }
    </mat-nav-list>
  </div>
  `,
})
export class CustomeSidenav {
  items = signal<MenuItem[]>([
    {path:'/dashboard', icon:'dashboard', label:'Dashboard'},
    {path: '/videos', icon:'video_library', label:'Videos'},
    {path: '/analytics', icon:'bar_chart', label: 'Analytics'},
    {path: '/settings', icon: 'settings', label: 'Settings'},
  ]);

  collapsed = input.required<boolean>()
}
