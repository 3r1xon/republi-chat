import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';



@NgModule({
  declarations: [
    ChatComponent,
    ChannelsComponent,
    ChannelInfoComponent
  ],
  exports: [
    ChatComponent,
    ChannelsComponent,
    ChannelInfoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainpageModule { }
