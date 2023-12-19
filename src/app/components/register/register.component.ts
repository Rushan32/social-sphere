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
// import { User } from "../../interfaces/auth";

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
        validators: passwordMatchValidator,
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
        const postData = { ...this.registerForm.value };
        delete postData.confirmPassword;

        // Check if the email is already registered using Firebase Authentication
        this.authService.getUserByEmail(postData.email as string).subscribe(
            (existingUsers) => {
                if (existingUsers.length > 0) {
                    // Email is already registered, show an error message
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Email is already registered',
                    });
                } else {
                    // Email is not registered, proceed with Firebase Authentication
                    this.authService.registerUser(postData.email as string, postData.password as string).subscribe(
                        (response) => {
                            console.log(response);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Registered Successfully',
                            });
                            this.router.navigate(['login']);
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Something went wrong',
                            });
                        }
                    );
                }
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Something went wrong',
                });
            }
        );
    }
}

// export class RegisterComponent {
//     registerForm = this.fb.group(
//         {
//             fullName: ['', [Validators.required]],
//             email: ['', [Validators.required, Validators.email]],
//             password: ['', Validators.required],
//             confirmPassword: ['', Validators.required],
//         },
//         {
//             validators: passwordMatchValidator,
//         }
//     );
//     constructor(
//         private fb: FormBuilder,
//         private authService: AuthService,
//         private messageService: MessageService,
//         private router: Router
//     ) {}
//     get fullName() {
//         return this.registerForm.controls['fullName'];
//     }
//     get email() {
//         return this.registerForm.controls['email'];
//     }
//     get password() {
//         return this.registerForm.controls['password'];
//     }
//     get confirmPassword() {
//         return this.registerForm.controls['confirmPassword'];
//     }
//
//     submitDetails() {
//         const postData = { ...this.registerForm.value };
//         delete postData.confirmPassword;
//
//         // Check if the email is already registered
//         this.authService.getUserByEmail(postData.email as string).subscribe(
//             existingUsers => {
//                 if (existingUsers.length > 0) {
//                     // Email is already registered, show an error message
//                     this.messageService.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Email is already registered',
//                     });
//                 } else {
//                     // Email is not registered, proceed with registration
//                     this.authService.registerUser(postData as User).subscribe(
//                         response => {
//                             console.log(response);
//                             this.messageService.add({
//                                 severity: 'success',
//                                 summary: 'Success',
//                                 detail: 'Registered Successfully',
//                             });
//                             this.router.navigate(['login']);
//                         },
//                         error => {
//                             this.messageService.add({
//                                 severity: 'error',
//                                 summary: 'Error',
//                                 detail: 'Something went wrong',
//                             });
//                         }
//                     );
//                 }
//             },
//             error => {
//                 this.messageService.add({
//                     severity: 'error',
//                     summary: 'Error',
//                     detail: 'Something went wrong',
//                 });
//             }
//         );
//     }
// }
