// comment.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { Comment } from "../interfaces/Comment";

@Injectable({
  providedIn: 'root',
})
export class CommentServiceService {
  private commentsCollection: AngularFirestoreCollection<Comment>;

  constructor(private firestore: AngularFirestore) {
    this.commentsCollection = this.firestore.collection('comments');
  }

  async addComment(comment: Comment): Promise<void> {
    // Assuming you're using AngularFire here
    await this.firestore.collection('comments').add(comment);
  }

  getCommentsForPost(postId: string): Observable<Comment[]> {
    return this.firestore
      .collection<Comment>('comments', (ref) => ref.where('postId', '==', postId).orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Comment;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  updateComment(commentId: string, updatedComment: Partial<Comment>): Promise<void> {
    return this.commentsCollection.doc(commentId).update(updatedComment).then(() => {});
  }

  deleteComment(commentId: string): Promise<void> {
    return this.commentsCollection.doc(commentId).delete().then(() => {});
  }

}
