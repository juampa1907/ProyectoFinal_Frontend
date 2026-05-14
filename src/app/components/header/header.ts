import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar>
      <button mat-icon-button (click)="onToggle.emit()">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
  `,
})
export class Header {
  onToggle = output();
}
