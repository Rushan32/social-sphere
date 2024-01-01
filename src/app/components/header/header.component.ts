import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ButtonModule} from "primeng/button";
import {Router, RouterLink} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {PostDashboardComponent} from "../post-dashboard/post-dashboard.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    ButtonModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    PostDashboardComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) {
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  dashboardActivate: boolean = false;
  showDashboard() {
    this.dashboardActivate=true;
  }

}
