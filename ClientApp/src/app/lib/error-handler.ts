import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { UtilsService } from "src/services/utils.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
      private _utils: UtilsService,
      private zone: NgZone
    ) {}

  handleError(error: any) {
    if (
      error instanceof HttpErrorResponse || 
      error instanceof HttpResponse ||
      error.rejection?.name == "HttpErrorResponse"
    ) return;

    console.error(error);

    this.zone.run(() => { 
      this._utils.showBugReport(error.rejection, error); 
    });
  }
}