import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { REPTextBoxComponent } from './lib/rep-textbox/rep-textbox.component';
import { REPInputComponent } from './lib/rep-input/rep-input.component';
import { REPMessageComponent } from './lib/rep-message/rep-message.component';
import { REPChatComponent } from './lib/rep-chat/rep-chat.component';
import { REPLoadingComponent } from './lib/rep-loading/rep-loading.component';
import { REPWindowComponent } from './lib/rep-window/rep-window.component';
import { REPButtonComponent } from './lib/rep-button/rep-button.component';
import { REPFooterComponent } from './lib/rep-footer/rep-footer.component';
import { REPSidemenuComponent } from './lib/rep-sidemenu/rep-sidemenu.component';
import { REPToggleComponent } from './lib/rep-toggle/rep-toggle.component';
import { REPRequestComponent } from './lib/rep-request/rep-request.component';
import { REPActionsComponent } from './lib/rep-actions/rep-actions.component';
import { REPSeparatorComponent } from './lib/rep-separator/rep-separator.component';
import { REPErrorComponent } from './lib/rep-error/rep-error.component';
import { REPTextareaComponent } from './lib/rep-textarea/rep-textarea.component';
import { REPInfoComponent } from './lib/rep-info/rep-info.component';
import { REPStatusBarComponent } from './lib/rep-status-bar/rep-status-bar.component';
import { REPProfilePicComponent } from './lib/rep-profile-pic/rep-profile-pic.component';
import { REPIconButtonComponent } from './lib/rep-icon-button/rep-icon-button.component';
import { REPImgUploadComponent } from './lib/rep-img-upload/rep-img-upload.component';
import { REPAccordionComponent } from './lib/rep-accordion/rep-accordion.component';
import { REPRoomComponent } from './lib/rep-room/rep-room.component';

import { PSignupComponent } from './pages/p-signup/p-signup.component';
import { PLoginComponent } from './pages/p-login/p-login.component';
import { PMainpageComponent } from './pages/p-mainpage/p-mainpage.component';
import { PSettingsComponent } from './pages/p-settings/p-main/p-main.component';
import { PProfileComponent } from './pages/p-settings/p-profile/p-profile.component';
import { PPrivacyComponent } from './pages/p-settings/p-privacy/p-privacy.component';
import { PUnauthorizedComponent } from './pages/p-unauthorized/p-unauthorized.component';
import { PNewChannelComponent } from './pages/p-settings/p-newchannel/p-newchannel.component';
import { PNotFoundComponent } from './pages/p-not-found/p-not-found.component';
import { PChannelSettingsComponent } from './pages/p-settings/p-channel-settings/p-channel-settings.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { MatRippleModule } from '@angular/material/core';
import { InterceptorService } from 'src/services/interceptor.service';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GlobalErrorHandler } from './lib/error-handler';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PAppearanceComponent } from './pages/p-settings/p-appearance/p-appearance.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    AppComponent,

    REPTextBoxComponent,
    REPMessageComponent,
    REPChatComponent,
    REPInputComponent,
    REPButtonComponent,
    REPLoadingComponent,
    REPWindowComponent,
    REPFooterComponent,
    REPSidemenuComponent,
    REPToggleComponent,
    REPRequestComponent,
    REPActionsComponent,
    REPSeparatorComponent,
    REPErrorComponent,
    REPTextareaComponent,
    REPInfoComponent,
    REPStatusBarComponent,
    REPProfilePicComponent,
    REPIconButtonComponent,
    REPImgUploadComponent,
    REPAccordionComponent,
    REPRoomComponent,

    PChannelSettingsComponent,
    PSignupComponent,
    PLoginComponent,
    PMainpageComponent,
    PSettingsComponent,
    PProfileComponent,
    PPrivacyComponent,
    PUnauthorizedComponent,
    PNewChannelComponent,
    PNotFoundComponent,
    PAppearanceComponent,

    StopPropagationDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true 
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
