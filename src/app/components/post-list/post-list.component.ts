import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../post";
import {PostServiceService} from "../../services/post-service.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import { CommonModule } from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    RouterLink,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{

  posts?: Observable<Post[]>
  constructor(private postService: PostServiceService, public auth: AuthService) {
  }

  ngOnInit() {
    this.posts = this.postService.getPosts()
  }

  async delete(id: string | undefined) {
    await this.postService.delete(id as string);
  }

}
