import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './core/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    @if (isLoading) {
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 18px;
        color: #666;
      ">
        Checking authentication...
      </div>
    } @else {
      <router-outlet />
    }
  `
})
export class AppComponent implements OnInit {
  protected readonly auth = inject(Auth);

  isLoading = true;

  ngOnInit() {
    this.auth.initialize()
      .then(() => {
      })
      .catch((error) => {
        console.error('Auth initialization failed:', error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}