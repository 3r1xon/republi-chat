import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PSignupComponent } from './pages/p-pre-login/p-signup/p-signup.component';
import { PLoginComponent } from './pages/p-pre-login/p-login/p-login.component';
import { PMainpageComponent } from './pages/p-mainpage/p-mainpage.component';
import { PSettingsComponent } from './pages/p-settings/p-main/p-main.component';
import { PProfileComponent } from './pages/p-settings/p-profile/p-profile.component';
import { PPrivacyComponent } from './pages/p-settings/p-privacy/p-privacy.component';
import { PUnauthorizedComponent } from './pages/p-unauthorized/p-unauthorized.component';
import { PNewChannelComponent } from './pages/p-settings/p-newchannel/p-newchannel.component';
import { PNotFoundComponent } from './pages/p-not-found/p-not-found.component';
import { PChannelSettingsComponent } from './pages/p-settings/p-channel-settings/p-channel-settings.component';
import { PVerificationComponent } from './pages/p-pre-login/p-verification/p-verification.component';
import { PAppearanceComponent } from './pages/p-settings/p-appearance/p-appearance.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { InterceptorService } from 'src/services/interceptor.service';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainpageModule } from './pages/p-mainpage/mainpage.module';
import { REPModule } from './lib/rep.module';
import { MatRippleModule } from '@angular/material/core';
import { GlobalErrorHandler } from './pages/error-handler';
import { MTDModule } from './pages/components/mtd-module.module';
import { FilterMembersPipe } from 'src/pipes/filter-members-members.pipe';



@NgModule({
  declarations: [
    AppComponent,

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
    PVerificationComponent,

    FilterMembersPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule,
    MainpageModule,
    MatRippleModule,
    REPModule,
    MTDModule
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
