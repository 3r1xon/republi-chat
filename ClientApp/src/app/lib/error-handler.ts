import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { UtilsService } from "src/services/utils.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
      private _utils: UtilsService,
      private zone: NgZone
    ) {}

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) return;

    this.zone.run(() => { 
      this._utils.showBugReport(error.rejection, error); 
    });
  }
}