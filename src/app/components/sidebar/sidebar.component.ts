import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/auth';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  user: User | null = null;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  ngOnInit() {
    const userEmail = sessionStorage.getItem('email');
    this.authService.getUserByEmail(userEmail as string).subscribe(
      users => {
        this.user = users.length > 0 ? users[0] : null;
      },
      error => {
        console.error('Error retrieving user details:', error);
      }
    );
  }
}
