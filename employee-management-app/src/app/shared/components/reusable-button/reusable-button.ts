import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reusable-button',
  imports: [MatButtonModule],
  templateUrl: './reusable-button.html',
  styleUrl: './reusable-button.scss'
})


export class ReusableButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  onClick(event: Event) {
    // Optional: you can emit events if needed
    console.log("button clicked!!");
  }
}
