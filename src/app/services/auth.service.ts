import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import {catchError, from, Observable, switchMap} from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root',
})

export class AuthService {
    authState: any = null;
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
      this.afAuth.authState.subscribe(data => this.authState = data)
  }

  get authenticated() {
      return this.authState !== null;
  }

  get currentUserId() {
      return this.authenticated ? this.authState.uid : null;
  }

  currentUser$ = this.afAuth.authState;
  registerUser(email: string, password:string) {
    return from(
        this.afAuth.createUserWithEmailAndPassword(
            email,
            password
        )
    );
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.firestore
        .collection<User>('users', (ref) => ref.where('email', '==', email))
        .valueChanges();
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }


  updateProfileData(profileData: Partial<firebase.UserInfo>): Observable<any> {
    return this.currentUser$.pipe(
        switchMap((user) => {
          if (!user) {
            throw new Error('Not Authenticated');
          }
          return from(user.updateProfile(profileData)).pipe(
              catchError((error) => {
                console.error('Update profile error:', error);
                throw error;
              })
          );
        })
    );
  }
}
