import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PostServiceService} from "../../services/post-service.service";
import {Post} from "../post";
import {CommonModule, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatCardModule} from "@angular/material/card";
import {AuthService} from "../../services/auth.service";
import {CommentServiceService} from "../../services/comment-service.service";
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import { Comment } from "../../interfaces/Comment";

@Component({
  selector: 'app-post-detail',
  standalone: true,
    imports: [
        NgIf,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        SidebarComponent,
        MatCardModule
    ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit, AfterViewInit {
  post: Post | undefined;
  comments: Comment[] = [];
  constructor(private route: ActivatedRoute,
              private postService: PostServiceService,
              private observer: BreakpointObserver,
              public auth: AuthService,
              private router: Router,
              private commentService: CommentServiceService
  ) {}

  ngOnInit() {
    this.getPost();
    this.getComments();
  }

  getComments() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.commentService.getCommentsForPost(postId).subscribe((comments) => {
        console.log('Retrieved comments:', comments);
        this.comments = comments;
      });
    }
  }

  newComment: string = '';

  addComment() {
    console.log('Adding comment:', this.newComment);
      const comment: Comment = {
        postId: this.route.snapshot.paramMap.get('id') || 'Unknown PostId',
        content: this.newComment,
        author: this.auth.currentUserId || 'Unknown AuthorId',
        authorEmail: this.auth.authState.email || 'Unknown User',
        createdAt: new Date(),
        authorImage: this.auth.authState.photoURL
      };

      this.commentService.addComment(comment).then(() => {
        console.log('Comment added successfully');
        this.newComment = ''; // Clear the comment input
        this.getComments(); // Refresh the comments list
      }).catch(error => {
        console.error('Error adding comment:', error);
      });
  }


    getPost(): void {
        const id = this.route.snapshot.paramMap.get('id')
        this.postService.getPostData(id as string).subscribe(post => (this.post = this.convertPost(post as Post)))
    }

    convertPost(post: Post) {
      return {
          ...post,
          // published: new Date(post.published)
      }
    }

    async delete() {
        const id = this.route.snapshot.paramMap.get('id')
        await this.postService.delete(id as string)
        await this.router.navigate(['/home'])
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
