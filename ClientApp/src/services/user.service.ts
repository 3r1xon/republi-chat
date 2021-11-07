import { Injectable } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public currentUser?: Account;

}
