import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatISO } from 'date-fns';
import { User } from '@angular/fire/auth';
import {IPost} from "../../interfaces/post.interface";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  @Output() newPost = new EventEmitter<Omit<IPost, 'id'>>();
  @Input() user!: User;
 postMessage = '';
  constructor() {}

  get isPostEmpty() {
    return this.postMessage.trim().length === 0;
  }
  onSubmit($event: Event) {
    $event.preventDefault();
    if (this.isPostEmpty) {
      return;
    }
    this.newPost.emit({
      content: this.postMessage,
      likedBy: [],
      commentedBy: [],
      createdAt: formatISO(new Date()),
      by: {
        id: this.user.uid,
        name: this.user.displayName || this.user.email || '',
        username: '',
        profileURL: this.user.photoURL || '',
      },
    });
    this.postMessage = '';
  }
}
