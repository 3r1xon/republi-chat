import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REPModule } from 'src/app/lib/rep.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MTDChatComponent } from './components/mtd-chat/mtd-chat.component';
import { MTDChannelsComponent } from './components/mtd-channels/mtd-channels.component';
import { MTDChannelInfoComponent } from './components/mtd-channel-info/mtd-channel-info.component';
import { MTDStatusBarComponent } from './components/mtd-status-bar/mtd-status-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MTDModule } from '../components/mtd-module.module';
import { MTDRoomCreationComponent } from './components/mtd-room-creation/mtd-room-creation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterOnlineMembersPipe } from 'src/pipes/filter-online-members.pipe';
import { FilterOfflineMembersPipe } from 'src/pipes/filter-offline-members.pipe';



@NgModule({
  declarations: [
    MTDChatComponent,
    MTDChannelsComponent,
    MTDChannelInfoComponent,
    MTDStatusBarComponent,
    MTDRoomCreationComponent,

    FilterOnlineMembersPipe,
    FilterOfflineMembersPipe
  ],
  exports: [
    MTDChatComponent,
    MTDChannelsComponent,
    MTDChannelInfoComponent,
    MTDStatusBarComponent,
    MTDRoomCreationComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    REPModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
    MTDModule
  ]
})
export class MainpageModule { }
