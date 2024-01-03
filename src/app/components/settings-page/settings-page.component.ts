import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  constructor(private router: Router) {
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
