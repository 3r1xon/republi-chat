import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';

import { REPTextBoxComponent } from './rep-textbox/rep-textbox.component';
import { REPNameBoxComponent } from './rep-namebox/rep-namebox.component';
import { REPChatComponent } from './rep-chat/rep-chat.component';
import { REPInputComponent } from './rep-input/rep-input.component';
import { REPButtonComponent } from './rep-button/rep-button.component';
import { REPLoadingComponent } from './rep-loading/rep-loading.component';
import { REPWindowComponent } from './rep-window/rep-window.component';
import { REPToggleComponent } from './rep-toggle/rep-toggle.component';
import { REPActionsComponent } from './rep-actions/rep-actions.component';
import { REPSeparatorComponent } from './rep-separator/rep-separator.component';
import { REPTextareaComponent } from './rep-textarea/rep-textarea.component';
import { REPInfoComponent } from './rep-info/rep-info.component';
import { REPProfilePicComponent } from './rep-profile-pic/rep-profile-pic.component';
import { REPIconButtonComponent } from './rep-icon-button/rep-icon-button.component';
import { REPImgUploadComponent } from './rep-img-upload/rep-img-upload.component';
import { REPAccordionComponent } from './rep-accordion/rep-accordion.component';
import { REPRoomComponent } from './rep-room/rep-room.component';
import { REPTabsComponent } from './rep-tabs/rep-tabs.component';
import { REPContextDirective } from './directives/rep-context.directive';
import { REPStopDirective } from './directives/rep-stop.directive';
import { REPEntriesComponent } from './rep-entries/rep-entries.component';





@NgModule({
  declarations: [
    REPTextBoxComponent,
    REPNameBoxComponent,
    REPChatComponent,
    REPInputComponent,
    REPButtonComponent,
    REPLoadingComponent,
    REPWindowComponent,
    REPTabsComponent,
    REPToggleComponent,
    REPActionsComponent,
    REPSeparatorComponent,
    REPTextareaComponent,
    REPInfoComponent,
    REPProfilePicComponent,
    REPIconButtonComponent,
    REPImgUploadComponent,
    REPAccordionComponent,
    REPRoomComponent,
    REPEntriesComponent,

    REPStopDirective,
    REPContextDirective,
  ],
  exports: [
    REPTextBoxComponent,
    REPNameBoxComponent,
    REPChatComponent,
    REPInputComponent,
    REPButtonComponent,
    REPLoadingComponent,
    REPWindowComponent,
    REPTabsComponent,
    REPToggleComponent,
    REPActionsComponent,
    REPSeparatorComponent,
    REPTextareaComponent,
    REPInfoComponent,
    REPProfilePicComponent,
    REPIconButtonComponent,
    REPImgUploadComponent,
    REPAccordionComponent,
    REPRoomComponent,
    REPEntriesComponent,

    REPStopDirective,
    REPContextDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatBadgeModule
  ]
})
export class REPModule { }
