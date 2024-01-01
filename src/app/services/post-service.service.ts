import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Import the map operator

import { Post } from "../components/post";

@Injectable({
    providedIn: 'root'
})
export class PostServiceService {
    postsCollection: AngularFirestoreCollection<Post>

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
}
