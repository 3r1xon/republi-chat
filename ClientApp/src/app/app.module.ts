import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { FlatInputComponent } from './flat-input/flat-input.component';
import { FlatButtonComponent } from './flat-button/flat-button.component';
import { MatRippleModule } from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SettingsComponent } from './settings/settings.component';
import { InterceptorService } from 'src/services/interceptor.service';
import { LoadingComponent } from './loading/loading.component';
import { FlatWindowMenuComponent } from './flat-window-menu/flat-window-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    TextBoxComponent,
    MessageBoxComponent,
    ChatComponent,
    SignupComponent,
    FlatInputComponent,
    FlatButtonComponent,
    LoginComponent,
    MainpageComponent,
    SettingsComponent,
    LoadingComponent,
    FlatWindowMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatRippleModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
