import { HttpClient } from "@angular/common/http";

export abstract class REPManager {

  constructor(
    public http: HttpClient
  ) { }

  private values: any;

  private originalValues: any;

  private API_METHOD: string;

  private API_URL: string;

  public setSaveAPI(method: string, url: string): void {
    this.API_METHOD = method.toLowerCase();

    this.API_URL = url;
  }

  public setValues(values: any): void {
    this.values = values;

    this.originalValues = { ...values };
  }

  public save() {

    const saveValues = this.getDirties();

    return this.http[this.API_METHOD](this.API_URL, saveValues).toPromise();
  };

  public isAnyDirty() {

    for (const key in this.values) {
      if (this.values[key] != this.originalValues[key]) {
        return true;
      }
    }

    return false;
  }

  public getDirties() {
    const dirties = { };

    for (const key in this.values) {
      if (this.values[key] != this.originalValues[key]) {
        dirties[key] = this.values[key];
      }
    }

    return dirties;
  }

}
