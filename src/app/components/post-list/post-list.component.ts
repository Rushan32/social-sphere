import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../post";
import {PostServiceService} from "../../services/post-service.service";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{
  posts: Observable<Post[]> | undefined
  constructor(private postService: PostServiceService) {
  }

  ngOnInit() {
    this.posts = this.postService.getPosts()
  }
}
