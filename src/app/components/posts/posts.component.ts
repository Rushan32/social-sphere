import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatDistance, parseISO } from 'date-fns';
import { IPost } from "../../interfaces/post.interface";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  @Input() post!: IPost;
  @Output() postLiked = new EventEmitter<IPost>();
  @Output() postCommented = new EventEmitter<{
    post: IPost;
    comment: string;
  }>();
  constructor() {}

  get postCreatedAt(): string {
    if (!this.post) {
      return '';
    }
    return formatDistance(parseISO(this.post?.createdAt), new Date());
  }

  commentOnPost() {
    const comment = prompt("What's your comment?");
    if (comment && comment.trim().length) {
      this.postCommented.emit({
        post: this.post,
        comment,
      });
    }
  }
}
