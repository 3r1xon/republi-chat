import { Pipe, PipeTransform } from '@angular/core';
import { Account, UserStatus } from 'src/interfaces/account.interface';

@Pipe({
  name: 'filterOfflineMembers',
  pure: false
})
export class FilterOfflineMembersPipe implements PipeTransform {

  transform(members: Array<Account>, ...args: unknown[]): unknown {
    return members.filter(member => member.userStatus == UserStatus.offline);
  }

}
