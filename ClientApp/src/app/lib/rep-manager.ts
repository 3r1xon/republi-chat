import { HttpClient } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";

export abstract class REPManager {

  constructor(
    public http: HttpClient
  ) { }

  private values: FormGroup;

  private API_METHOD: string;

  private API_URL: string;

  public valueChanges: Observable<any>;

  public setSaveAPI(method: string, url: string): void {
    this.API_METHOD = method.toLowerCase();

    this.API_URL = url;
  }

  public setValues(values: FormGroup): void {
    this.values = values;

    this.valueChanges = this.values.valueChanges;
  }

  public save(): Promise<any> {
    const saveValues = this.getDirties();

    return this.http[this.API_METHOD](this.API_URL, saveValues).toPromise();
  };

  public canSave(): boolean {
    return this.values.dirty && this.values.valid;
  }

  public reset(): void {
    this.values.markAsPristine();
  }

  public getDirties(): object {
    const dirties = { };

    Object.keys(this.values.controls)
      .forEach(key => {
        const currentControl = this.values.controls[key];

        if (currentControl.dirty)
          dirties[key] = currentControl.value;
      });

    return dirties;
  }

  public setDirty(value: string) {
    this.values.controls[value].markAsDirty();
  }

}
