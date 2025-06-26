import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule],
  templateUrl: "navbar.html",
  styleUrl: "navbar.scss"
})

export class NavbarComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService) { }

  confirmLogout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '80vh',
      hasBackdrop: true,
      data: <ConfirmDialogData>{
        title: 'Logout Confirmation',
        message: 'Are you sure you want to log out?',
        confirmText: 'Logout',
        cancelText: 'Stay'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  logout() {
    this.cookieService.delete('token', '/');
    this.router.navigate(['/login']);
  }
}
