import { Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
<mat-toolbar class="shadow-sm" style="background-image: url('/fondo5.jpg'); background-position: center">
  <button mat-icon-button (click)="onToggle.emit()">
    <div class="flex flex-col justify-center items-center gap-[5px] w-5 h-5">
      
      <span class="block h-[2px] w-5 bg-white rounded-full origin-center
                   transition-all duration-300 ease-in-out"
            >
      </span>

      <span class="block h-[2px] w-5 bg-white rounded-full
                   transition-all duration-200 ease-in-out"
            >
      </span>

      <span class="block h-[2px] w-5 bg-white rounded-full origin-center
                   transition-all duration-300 ease-in-out"
            >
      </span>

    </div>
  </button>
</mat-toolbar>
  `,
})
export class Header {
  collapsed = input<boolean>(false);
  onToggle = output<void>();
}
