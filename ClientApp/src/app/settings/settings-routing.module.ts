import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './mainsettings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    pathMatch: 'full',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full',
        outlet: 'settings'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
