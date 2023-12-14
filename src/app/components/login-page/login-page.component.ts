import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    RouterLink,
    ImageModule,
    NgIf,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.getUserByEmail(email as string).subscribe(response => {
      if (response.length > 0 && response[0].password === password) {
        sessionStorage.setItem('email', email as string);
        this.router.navigate(['/home']);
      } else {
        if (response.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Sorry we could not find your account',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email or password is incorrect',
          });
        }
      }
    });
  }
}
