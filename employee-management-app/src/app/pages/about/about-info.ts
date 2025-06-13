import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-info',
  imports: [MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './about-info.html',
  styleUrl: './about-info.scss'
})
export class AboutComponent {

}
