import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//import { User } from '../../interfaces/auth';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {BreakpointObserver} from "@angular/cdk/layout";
import {NewPostComponent} from "../new-post/new-post.component";

import { User, Auth, user } from '@angular/fire/auth';
import { IPost } from "../../interfaces/post.interface";

import {
  collection,
  collectionChanges,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getFirestore,
  orderBy,
  query,
  CollectionReference,
  DocumentChange,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';
import {async} from "rxjs";
import {PostsComponent} from "../posts/posts.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    SidebarComponent,
    NewPostComponent,
    PostsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  // user?: User;
  constructor (
    private router: Router,
    private authService: AuthService,
    private observer: BreakpointObserver,
    auth: Auth
  ) {
    this.user$ = user(auth);
    this.getPosts();
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }





  user$: Observable<User | null>;

  allPosts: IPost[] = [];



  async getPosts() {
    const user = await this.getUser();
    collectionChanges<IPost>(
      query<IPost>(
        collection(getFirestore(), 'posts') as CollectionReference<IPost>,
        orderBy('createdAt', 'desc')
      )
    ).subscribe((posts) => {
      console.log(posts);
      posts.map((snapshot) => {
        this.onPostSnapshot(snapshot, user);
      });
    });
  }

  onPostSnapshot(change: DocumentChange<IPost>, user: User | null) {
    const data = change.doc.data() as IPost;
    switch (change.type) {
      case 'added':
        const post = {
          ...data,
          id: change.doc.id,
          liked: !!user && !!data.likedBy.includes(user.uid),
        };
        this.allPosts.splice(change.newIndex, 0, post);
        break;
      case 'removed':
        this.allPosts.splice(change.oldIndex, 1);
        break;
      case 'modified':
        if (change.newIndex === change.oldIndex) {
          this.allPosts[change.oldIndex] = {
            ...data,
            id: change.doc.id,
            liked: !!user && !!data.likedBy.includes(user.uid),
          };
        } else {
          this.allPosts.splice(change.oldIndex, 1);
          this.allPosts.splice(change.newIndex, 0, {
            ...data,
            id: change.doc.id,
            liked: !!user && !!data.likedBy.includes(user.uid),
          });
        }
        break;
    }
  }

  async getUser(): Promise<User | null> {
    const user = await this.user$.pipe(take(1)).toPromise();
    return user || null;
  }

  addNewPost(newPost: Omit<IPost, 'id'>) {
    addDoc(collection(getFirestore(), 'posts'), newPost);
  }

  async onPostLike(post: IPost) {
    const user = await this.getUser();
    if (!user) {
      return;
    }
    const likeDocRef = doc(
      getFirestore(),
      `posts/${post.id}/likes/${user.uid}`
    );
    const document = await getDoc(likeDocRef);
    const docExists = document.exists();
    if (docExists) {
      post.likedBy = post.likedBy.filter((id) => id !== user.uid);
      post.liked = false;
      await deleteDoc(likeDocRef);
    } else {
      post.likedBy.push(user.uid);
      post.liked = true;
      await setDoc(likeDocRef, {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
    const docRef = doc(getFirestore(), `posts/${post.id}`);
    const { liked, commented, ...updatedPost } = post;
    updateDoc(docRef, {
      ...updatedPost,
    });
  }

  async onPostComment(event: { post: IPost; comment: string }) {
    const { post, comment } = event;
    if (post.commentedBy.length === 0) {
      post.commentedBy.push(Date.now().toString());
    } else {
      post.commentedBy.length = 0;
    }
    console.log(post);
  }






/*
  ngOnInit() {
    const userEmail = sessionStorage.getItem('email');
    this.authService.getUserByEmail(userEmail as string).subscribe(
      users => {
        this.user = users[0];
      },
      error => {
        console.error('Error retrieving user details:', error);
      }
    );
  }
  */




  @ViewChild(MatSidenav)
  sidenav!:MatSidenav;
  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res)=> {
      if (res.matches) {
        this.sidenav.mode='over';
        this.sidenav.close();
      } else {
        this.sidenav.mode='side';
        this.sidenav.open();
      }
    })
  }

  protected readonly async = async;
  protected readonly async = async;
  protected readonly async = async;
  protected readonly async = async;
}
