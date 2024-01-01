import {Component, OnInit} from '@angular/core';
import {NgIf, CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {catchError, concatMap,  throwError} from "rxjs";
import firebase from "firebase/compat";

@Component({
  selector: 'app-profile-page',
  standalone: true,
    imports: [
        NgIf,
        MatButtonModule,
        MatIconModule,
        CommonModule
    ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit{
    user$ = this.authService.currentUser$;
    constructor(private authService: AuthService,
                private imageUploadService: ImageUploadService) {}

    ngOnInit(): void {}

    uploadImage(event: any, user: firebase.User) {
        const file = event.target.files[0];

        if (!file) {
            console.error('No file selected');
            return;
        }

        this.imageUploadService.uploadImage(file, `images/profile/${user.uid}`).pipe(
            concatMap((photoUrl) => this.authService.updateProfileData({ photoURL: photoUrl })),
            catchError((error) => {
                console.error('Image upload error:', error);
                // Handle the error, you can choose to throw it again or handle it here.
                return throwError(error);
            })
        ).subscribe();
    }

}
