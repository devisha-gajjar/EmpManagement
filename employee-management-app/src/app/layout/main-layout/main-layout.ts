import { Component } from '@angular/core';
import { NavbarComponent } from '../../pages/home/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../pages/home/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {

}
