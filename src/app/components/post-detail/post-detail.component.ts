import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {PostServiceService} from "../../services/post-service.service";
import {Post} from "../post";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined
  constructor(private route: ActivatedRoute, private postService: PostServiceService) {
  }

  ngOnInit() {
    this.getPost()
  }

  getPost() {
    const id = this.route.snapshot.paramMap.get('id');
    return this.postService.getPostData(id as string).subscribe(data => this.post = data)
  }
}
