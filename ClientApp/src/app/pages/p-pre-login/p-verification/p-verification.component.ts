import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerResponse } from 'src/interfaces/response.interface';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-verification.component.html',
  styleUrls: ['./p-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PVerificationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private _user: UserService,
    private cd: ChangeDetectorRef
  ) { }

  public title: string = "Veryfing account...";

  public response: string = "";

  public verified: boolean;

  ngOnInit(): void {
    const verification_code = this.route.snapshot.paramMap.get("verification_code");

    this._user.API_verify(verification_code)
      .toPromise()
      .then((response: ServerResponse) => {
        this.title = "Verified successfully!";
        this.response = response.message;
        this.verified = true;
      })
      .catch((response: HttpErrorResponse) => {
        this.title = "Invalid verification code!";
        this.response = response.error.message;
        this.verified = false;
      })
      .finally(() => {
        this.cd.markForCheck();
      });
  }

}
