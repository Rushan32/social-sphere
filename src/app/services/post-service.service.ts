import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Import the map operator
import { Post } from "../components/post";

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  postsCollection: AngularFirestoreCollection<Post>
  postDoc: AngularFirestoreDocument<Post> | undefined
  constructor(private afs: AngularFirestore) {
      this.postsCollection = this.afs.collection('posts', ref => ref.orderBy('published', 'desc'))
  }

  getPosts(): Observable<Post[]> {
    return this.postsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
        });
      })
    );
  }

    getPostData(id: string) {
        this.postDoc = this.afs.doc<Post>(`posts/${id}`)
        return this.postDoc.valueChanges()
    }


    create(data: Post) {
        this.postsCollection.add(data)
    }

  getPost(id: string) {
    return this.afs.doc<Post>(`posts/${id}`)
  }
  delete(id: string) {
    return this.getPost(id).delete()
  }
  // update(id: string, formData) {
  //   return this.getPost(id).update(formData)
  // }
}
