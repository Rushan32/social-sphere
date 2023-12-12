import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../interfaces/auth";
import {MatSidenavModule} from "@angular/material/sidenav";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    MatSidenavModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  user: User | null = null;
  constructor(private router: Router,
              private authService: AuthService) {}
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
    )
  }
}
