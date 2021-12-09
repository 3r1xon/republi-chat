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
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection;
    } else return;
    
    this.zone.run(() =>
      this._utils.showRequest(error?.status, error?.message, () => { })
    );
  }
}