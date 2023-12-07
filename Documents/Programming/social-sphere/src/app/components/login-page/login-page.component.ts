import {Component, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit{
  constructor() {
  }
  ngOnInit() : void {
  }
}
