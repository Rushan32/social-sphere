import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { Component } from '@angular/core';
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
  constructor() {}

}
