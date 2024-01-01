import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/auth';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, NgIf} from "@angular/common";
import {HomeComponent} from "../home/home.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  user$ = this.authService.currentUser$;
  constructor(
    private router: Router,
    private authService: AuthService,
    private home: HomeComponent
  ) {}
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  showDashboard() {
    this.home.dashboardActivate=true;
  }

  ngOnInit() {
    const userEmail = sessionStorage.getItem('email');
    this.authService.getUserByEmail(userEmail as string).subscribe(
      users => {
        // this.user = users.length > 0 ? users[0] : null;
        console.log(users);
      },
      error => {
        console.error('Error retrieving user details:', error);
      }
    );
  }
}
