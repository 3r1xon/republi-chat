import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REPModule } from 'src/app/lib/rep.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MTDChatComponent } from './components/mtd-chat/mtd-chat.component';
import { MTDChannelsComponent } from './components/mtd-channels/mtd-channels.component';
import { MTDChannelInfoComponent } from './components/mtd-channel-info/mtd-channel-info.component';
import { MTDStatusBarComponent } from './components/mtd-status-bar/mtd-status-bar.component';



@NgModule({
  declarations: [
    MTDChatComponent,
    MTDChannelsComponent,
    MTDChannelInfoComponent,
    MTDStatusBarComponent
  ],
  exports: [
    MTDChatComponent,
    MTDChannelsComponent,
    MTDChannelInfoComponent,
    MTDStatusBarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    REPModule
  ]
})
export class MainpageModule { }
