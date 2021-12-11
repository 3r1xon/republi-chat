import { Injectable } from '@angular/core';
import { Request } from 'src/interfaces/request.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { BugReport } from 'src/interfaces/bugreport.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  // Every HTTP Request, except black listed ones, will set 
  // this variable to true till a response has been received
  // and then the variable will be set to false again.
  public loading: boolean = false;

  public rqsBody: Request;

  // Overload
  public showRequest(title: string, message: string, onAccept: Function): void;

  public showRequest(title: string, message: string, onAccept: Function, actions?: Array<REPButton>): void {

    if (actions) {
      this.rqsBody = {
        title: title,
        message: message,
        actions: actions,
        visible: true
      };
    }
    else {
      this.rqsBody = {
        title: title,
        message: message,
        actions: [
          {
            name: "Yes",
            onClick: onAccept,
            background: "danger",
            icon: "done"
          },
          {
            name: "No",
            onClick: () => {
              this.rqsBody.visible = false;
            },
            background: "success",
            icon: "not_interested"
          }
        ],
        visible: true
      };
    }
  }

  public bugReport: BugReport;

  public showBugReport(title: string, callstack: string) {

    this.bugReport = {
      title: title,
      callstack: callstack,
      visible: true
    };

  }
}