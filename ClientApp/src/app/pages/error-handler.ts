import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { UtilsService } from "src/services/utils.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private _utils: UtilsService,
    private zone: NgZone
  ) {}

  private nReportSent: number = 0;

  handleError(error: any) {
    if (
      error instanceof HttpErrorResponse ||
      error instanceof HttpResponse ||
      error.rejection?.name == "HttpErrorResponse"
    ) return;

    console.error(error);

    this.zone.run(() => {

      this._utils.showBugReport(error.name, error.stack);

      if (this.nReportSent < 5) {

        this._utils.API_sendReport(error.name, error.stack.toString()).toPromise();

        this.nReportSent++;
      }
    });
  }
}
