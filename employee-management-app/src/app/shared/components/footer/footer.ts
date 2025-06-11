import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar class="footer-toolbar">
      <span>&copy; 2025 Devisha Gajjar. All rights reserved.</span>
    </mat-toolbar>
  `,
  styleUrl : "footer.css"
})
  
export class FooterComponent {}
