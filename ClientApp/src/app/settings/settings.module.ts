import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './mainsettings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
  ],
  imports: [
    SettingsRoutingModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [SettingsComponent],
})
export class SettingsModule { }