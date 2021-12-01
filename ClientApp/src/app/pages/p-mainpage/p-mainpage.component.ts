import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss']
})
export class PMainpageComponent implements OnInit {

  constructor(public _user: UserService) { }

  ngOnInit(): void {
  }

}
