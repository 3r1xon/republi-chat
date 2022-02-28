import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';
import { REPModule } from 'src/app/lib/rep.module';



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
    CommonModule,
    REPModule
  ]
})
export class MainpageModule { }
