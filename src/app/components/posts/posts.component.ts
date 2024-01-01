import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-posts',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  constructor() {}

}
