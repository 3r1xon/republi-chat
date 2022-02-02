import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from 'src/services/user.service';

import { PLoginComponent } from './pages/p-login/p-login.component';
import { PMainpageComponent } from './pages/p-mainpage/p-mainpage.component';
import { PNotFoundComponent } from './pages/p-not-found/p-not-found.component';
import { PChannelSettingsComponent } from './pages/p-settings/p-channel-settings/p-channel-settings.component';
import { PSettingsComponent } from './pages/p-settings/p-main/p-main.component';
import { PNewChannelComponent } from './pages/p-settings/p-newchannel/p-newchannel.component';
import { PPrivacyComponent } from './pages/p-settings/p-privacy/p-privacy.component';
import { PProfileComponent } from './pages/p-settings/p-profile/p-profile.component';
import { PSignupComponent } from './pages/p-signup/p-signup.component';
import { PUnauthorizedComponent } from './pages/p-unauthorized/p-unauthorized.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: PSignupComponent, pathMatch: 'full' },
  { path: 'login', component: PLoginComponent, pathMatch: 'full' },
  { path: 'mainpage', component: PMainpageComponent, pathMatch: 'full', canActivate: [UserService] },
  { path: 'unauthorized', component: PUnauthorizedComponent, pathMatch: 'full' },
  { 
    path: 'settings',
    component: PSettingsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PProfileComponent, pathMatch: 'full' },
      { path: 'privacy', component: PPrivacyComponent, pathMatch: 'full' },
      { path: 'newchannel', component: PNewChannelComponent, pathMatch: 'full'},
      { path: 'channelsettings', component: PChannelSettingsComponent, pathMatch: 'full' }
    ],
    canActivate: [UserService] 
  },
  { path: '**', redirectTo: '404' },
  { path: '404', component: PNotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
