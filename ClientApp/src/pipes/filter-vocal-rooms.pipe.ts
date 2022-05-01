import { Pipe, PipeTransform } from '@angular/core';
import { Room } from 'src/interfaces/channel.interface';

@Pipe({
  name: 'filterVocalRooms',
  pure: false
})
export class FilterVocalRoomsPipe implements PipeTransform {

  transform(rooms: Array<Room>, ...args: unknown[]): Array<Room> {
    return rooms.filter(room => room.textRoom == false);
  }

}
