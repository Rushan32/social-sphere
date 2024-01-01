import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PostServiceService} from "../../services/post-service.service";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {PostListComponent} from "../post-list/post-list.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-post-dashboard',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    PostListComponent,
    SidebarComponent,
  ],
  templateUrl: './post-dashboard.component.html',
  styleUrl: './post-dashboard.component.scss',
})
export class PostDashboardComponent implements AfterViewInit {
  title: string | undefined;
  image: string | undefined;
  content: string | undefined;
  constructor(private auth: AuthService, private postService: PostServiceService, private observer: BreakpointObserver) {
  }

  createPost() {
    const data = {
      author: this.auth.authState.displayName || this.auth.authState.email || 'Unknown Author',
      authorId: this.auth.currentUserId || 'Unknown AuthorId',
      content: this.content || '',
      image: this.image || '',
      published: new Date(),
      title: this.title || 'Untitled',
    };
    this.postService.create(data);
  }

  @ViewChild(MatSidenav)
  sidenav!:MatSidenav;
  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe(async (res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        await this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        await this.sidenav.open();
      }
    });
  }
}
