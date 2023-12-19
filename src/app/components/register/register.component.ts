import { Component} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../shared/password-match-directive';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [passwordMatchValidator]
      }
  );

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private messageService: MessageService,
      private router: Router
  ) {}

  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
      const userData = {...this.registerForm.value}
      this.authService.registerUser(userData.email as string, userData.password as string).
      subscribe(
          async ()=> {
              await this.router.navigate(['login']);
          },
          (error) => {
              console.error(error);
              if (error.code === 'auth/invalid-email') {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Sorry your email does not seem right. Try again.'

                  })
              } else if (error.code === 'auth/weak-password') {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Password must be at least 6 characters long and contain a non-alphanumeric character.'

                  })
              } else if (error.code === 'auth/email-already-in-use') {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Email is already registered',
                  })
              } else {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Something went wrong',
                  })
              }
          }
      )
  }
}

