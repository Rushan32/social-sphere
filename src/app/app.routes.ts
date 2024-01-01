import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import {SavedPageComponent} from "./components/saved-page/saved-page.component";
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";
import {SettingsPageComponent} from "./components/settings-page/settings-page.component";
import {PostListComponent} from "./components/post-list/post-list.component";
import {PostDetailComponent} from "./components/post-detail/post-detail.component";
import {PostDashboardComponent} from "./components/post-dashboard/post-dashboard.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'saved',
    component: SavedPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'blog',
    component: PostListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'blog/:id',
    component: PostDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: PostDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
