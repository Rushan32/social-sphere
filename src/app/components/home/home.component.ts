import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {BreakpointObserver} from "@angular/cdk/layout";
import {NewPostComponent} from "../new-post/new-post.component";
import {NgIf} from "@angular/common";
import {PostDashboardComponent} from "../post-dashboard/post-dashboard.component";
import {PostListComponent} from "../post-list/post-list.component";


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
        NgIf,
        PostDashboardComponent,
        PostListComponent,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  constructor (
    private observer: BreakpointObserver
  ) {
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
