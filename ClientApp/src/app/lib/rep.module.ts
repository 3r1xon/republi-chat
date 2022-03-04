import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REPTextBoxComponent } from './rep-textbox/rep-textbox.component';
import { REPMessageComponent } from './rep-message/rep-message.component';
import { REPChatComponent } from './rep-chat/rep-chat.component';
import { REPInputComponent } from './rep-input/rep-input.component';
import { REPButtonComponent } from './rep-button/rep-button.component';
import { REPLoadingComponent } from './rep-loading/rep-loading.component';
import { REPWindowComponent } from './rep-window/rep-window.component';
import { REPFooterComponent } from './rep-footer/rep-footer.component';
import { REPToggleComponent } from './rep-toggle/rep-toggle.component';
import { REPRequestComponent } from './rep-request/rep-request.component';
import { REPActionsComponent } from './rep-actions/rep-actions.component';
import { REPSeparatorComponent } from './rep-separator/rep-separator.component';
import { REPErrorComponent } from './rep-error/rep-error.component';
import { REPTextareaComponent } from './rep-textarea/rep-textarea.component';
import { REPInfoComponent } from './rep-info/rep-info.component';
import { REPProfilePicComponent } from './rep-profile-pic/rep-profile-pic.component';
import { REPIconButtonComponent } from './rep-icon-button/rep-icon-button.component';
import { REPImgUploadComponent } from './rep-img-upload/rep-img-upload.component';
import { REPAccordionComponent } from './rep-accordion/rep-accordion.component';
import { REPRoomComponent } from './rep-room/rep-room.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { GlobalErrorHandler } from './error-handler';
import { StopPropagationDirective } from '../directives/stop-propagation.directive';
import { REPTabsComponent } from './rep-tabs/rep-tabs.component';
import { REPMoreComponent } from './rep-more/rep-more.component';



@NgModule({
  declarations: [
    REPTextBoxComponent,
    REPMessageComponent,
    REPChatComponent,
    REPInputComponent,
    REPButtonComponent,
    REPLoadingComponent,
    REPWindowComponent,
    REPFooterComponent,
    REPTabsComponent,
    REPToggleComponent,
    REPRequestComponent,
    REPActionsComponent,
    REPSeparatorComponent,
    REPErrorComponent,
    REPTextareaComponent,
    REPInfoComponent,
    REPProfilePicComponent,
    REPIconButtonComponent,
    REPImgUploadComponent,
    REPAccordionComponent,
    REPRoomComponent,
    REPMoreComponent,

    StopPropagationDirective
  ],
  exports: [
    REPTextBoxComponent,
    REPMessageComponent,
    REPChatComponent,
    REPInputComponent,
    REPButtonComponent,
    REPLoadingComponent,
    REPWindowComponent,
    REPFooterComponent,
    REPTabsComponent,
    REPToggleComponent,
    REPRequestComponent,
    REPActionsComponent,
    REPSeparatorComponent,
    REPErrorComponent,
    REPTextareaComponent,
    REPInfoComponent,
    REPProfilePicComponent,
    REPIconButtonComponent,
    REPImgUploadComponent,
    REPAccordionComponent,
    REPRoomComponent,
    REPMoreComponent,

    StopPropagationDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRippleModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ]
})
export class REPModule { }
