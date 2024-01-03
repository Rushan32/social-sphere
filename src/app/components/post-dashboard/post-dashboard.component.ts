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
import {RouterLink} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";

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
    RouterLink,
  ],
  templateUrl: './post-dashboard.component.html',
  styleUrl: './post-dashboard.component.scss',
})
export class PostDashboardComponent implements AfterViewInit {
  title: string | undefined;
  image: string | undefined;
  content: string | undefined;
  constructor(private auth: AuthService,
              private postService: PostServiceService,
              private observer: BreakpointObserver,
              private storage: AngularFireStorage
  ) {}

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

  uploadImage(event: any) {
    const file: File | undefined = event?.target?.files?.[0];

    if (!file) {
      return alert('No file selected');
    }

    const path = `posts/${file.name}`;

    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Image Files');
    } else {
      const task = this.storage.upload(path, file);

      // Get notified when the download URL is available
      task.snapshotChanges().subscribe((snapshot) => {
        if (snapshot?.state === 'success') {
          // Get the download URL
          this.storage.ref(path).getDownloadURL().subscribe((url) => {
            this.image = url;
          });
        }
      });
    }
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
