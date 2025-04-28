import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component ({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  isLoggedIn = false;
  isMobileMenuOpen = false;

  constructor (private router: Router) {}

  navigateToHome() {
    this.router.navigate (['/']);
  }

  navigateToLogin() {
    this.router.navigate (['/login']);
  }

  navigateToRegister() {
    this.router.navigate (['/register']);
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate (['/']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
