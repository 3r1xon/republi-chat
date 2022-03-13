import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './p-verification.component.html',
  styleUrls: ['./p-verification.component.scss']
})
export class PVerificationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
    });

  }

}
