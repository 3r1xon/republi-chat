import { Injectable } from '@angular/core';
import { Request } from 'src/interfaces/request.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { BugReport } from 'src/interfaces/bugreport.interface';
import { UAParser } from 'ua-parser-js';
import { Settings } from 'src/interfaces/settings.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private http: HttpClient,
    private media: MediaMatcher,
  ) { }

  // Every HTTP Request, except black listed ones, will set
  // this variable to true till a response has been received
  // and then the variable will be set to false again.
  public loading: boolean = false;

  public wsConnected: boolean = false;

  public rqsBody: Request;

  public get isMobile() {
    return this.media.matchMedia('(max-width: 450px)').matches;
  }

  public mobileListener: Subject<any> = new Subject();

  /**
   * Default settings
   *
   */
  public settings: Settings = {
    showChannels: true,
    showServerGroup: true,
    animations: true,
    dateFormat: "dd/MM/yyyy HH:mm:ss"
  };

  /**
   * Shows a pop-up with a request.
   *
   * @param title The title in the header of the request.
   *
   * @param message The message you want to show to the user
   *
   * @param actions The list of buttons that appears in the bottom of the request
   *
   */
  public showRequest(title: string, message: string, actions?: Function | Array<REPButton>): void {

    if (typeof actions == 'object') {
      this.rqsBody = {
        title: title,
        message: message,
        actions: actions,
        visible: true
      };
    }
    else if (typeof actions == 'function') {
      this.rqsBody = {
        title: title,
        message: message,
        actions: [
          {
            name: "Yes",
            onClick: actions,
            background: "danger",
            icon: "done",
          },
          {
            name: "No",
            background: "success",
            autofocus: true,
            icon: "not_interested",
            onClick: () => {
              this.rqsBody.visible = false;
            }
          }
        ],
        visible: true
      };
    } else {
      this.rqsBody = {
        title: title,
        message: message,
        actions: [
          {
            name: "Close",
            background: "success",
            icon: "not_interested",
            autofocus: true,
            onClick: () => {
              this.rqsBody.visible = false;
            }
          }
        ],
        visible: true
      };
    };
  }

  public bugReport: BugReport;

  /**
   * Shows a pop-up with a unhandled error.
   *
   * @param title The name of the error.
   *
   * @param callstack The error callstack.
   *
   * @param send If the send report button must be shown.
   *
   */
  public showBugReport(title: string, callstack: string) {

    this.bugReport = {
      title: title,
      callstack: callstack,
      visible: true
    };

  }

  /**
   * Detect the current browser.
   *
   * @returns An object with all the browser informations.
   *
   */
  public detectBrowser(): UAParser {
    const parser = new UAParser();
    const result = parser.getResult();

    return result.browser;
  }

  public API_sendReport(title: string, callstack: string) {
    return this.http.post(`${environment.BASE_URL}/utils/sendReport`, { title: title, callstack: callstack });
  }
}
