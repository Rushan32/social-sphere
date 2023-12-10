import { Component } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {RouterLink} from "@angular/router";
import {passwordMatchValidator} from "../../shared/password-match-directive";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
      validators: passwordMatchValidator
  })
  constructor(private fb: FormBuilder) {}
  get fullName() {return this.registerForm.controls['fullName'];}
  get email() {return this.registerForm.controls['email'];}
  get password() {return this.registerForm.controls['password']}
  get confirmPassword() {return this.registerForm.controls["confirmPassword"]}
}
