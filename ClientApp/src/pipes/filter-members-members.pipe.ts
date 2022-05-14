import { Pipe, PipeTransform } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';

@Pipe({
  name: 'filterMembers'
})
export class FilterMembersPipe implements PipeTransform {

  transform(members: Array<Account>, ...args: unknown[]): Array<Account> {
    if (args[0] == "Banned") {
      return members.filter(member => member.banned);
    }

    return members.filter(member => !member.banned);
  }

}
