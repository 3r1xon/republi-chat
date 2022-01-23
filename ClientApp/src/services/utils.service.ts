import { Injectable } from '@angular/core';
import { Request } from 'src/interfaces/request.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { BugReport } from 'src/interfaces/bugreport.interface';
import { Platform } from '@angular/cdk/platform';
import { UAParser } from 'ua-parser-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private platform: Platform) { }

  // Every HTTP Request, except black listed ones, will set 
  // this variable to true till a response has been received
  // and then the variable will be set to false again.
  public loading: boolean = false;

  public rqsBody: Request;

  public showServerGroup: boolean = true;

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
            visible: () => true,
            enabled: () => true,
          },
          {
            name: "No",
            visible: () => true,
            enabled: () => true,
            onClick: () => {
              this.rqsBody.visible = false;
            },
            background: "success",
            icon: "not_interested"
          }
        ],
        visible: true
      };
    } else throw new Error("Typeof actions is not a Function or Array.");
  }

  public bugReport: BugReport;

  /**
   * Shows a pop-up with a unhandled error.
   *
   * @param title The name of the error.
   *
   * @param callstack The error callstack.
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
}