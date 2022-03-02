import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { REPModule } from 'src/app/lib/rep.module';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    ChatComponent,
    ChannelsComponent,
    ChannelInfoComponent,
    StatusBarComponent
  ],
  exports: [
    ChatComponent,
    ChannelsComponent,
    ChannelInfoComponent,
    StatusBarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    REPModule
  ]
})
export class MainpageModule { }
