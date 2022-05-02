import { Pipe, PipeTransform } from '@angular/core';
import { Account, UserStatus } from 'src/interfaces/account.interface';

@Pipe({
  name: 'filterOnlineMembers',
  pure: false
})
export class FilterOnlineMembersPipe implements PipeTransform {

  transform(members: Array<Account>, ...args: unknown[]): Array<Account> {
    return members.filter(member => member.userStatus == UserStatus.Online);
  }

}
