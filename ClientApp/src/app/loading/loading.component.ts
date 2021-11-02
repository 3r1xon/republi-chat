import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(public _utils: UtilsService) { }

  ngOnInit(): void {
  }

}
