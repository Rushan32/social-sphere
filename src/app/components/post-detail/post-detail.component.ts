import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PostServiceService} from "../../services/post-service.service";
import {Post} from "../post";
import {CommonModule, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatCardModule} from "@angular/material/card";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-post-detail',
  standalone: true,
    imports: [
        NgIf,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        SidebarComponent,
        MatCardModule
    ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit, AfterViewInit {
  post: Post | undefined
  constructor(private route: ActivatedRoute,
              private postService: PostServiceService,
              private observer: BreakpointObserver,
              public auth: AuthService,
              private router: Router
  ) {}

  ngOnInit() {
    this.getPost();
  }

    getPost(): void {
        const id = this.route.snapshot.paramMap.get('id')
        this.postService.getPostData(id as string).subscribe(post => (this.post = post))
    }

    async delete() {
        const id = this.route.snapshot.paramMap.get('id')
        await this.postService.delete(id as string)
        await this.router.navigate(['/home'])
    }


    @ViewChild(MatSidenav)
    sidenav!:MatSidenav;
    ngAfterViewInit(): void {
        this.observer.observe(['(max-width: 800px)']).subscribe(async (res) => {
            if (res.matches) {
                this.sidenav.mode = 'over';
                await this.sidenav.close();
            } else {
                this.sidenav.mode = 'side';
                await this.sidenav.open();
            }
        });
    }
}
