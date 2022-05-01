import { Pipe, PipeTransform } from '@angular/core';
import { Room } from 'src/interfaces/channel.interface';

@Pipe({
  name: 'filterTextRooms',
  pure: false
})
export class FilterTextRoomsPipe implements PipeTransform {

  transform(rooms: Array<Room>, ...args: unknown[]): Array<Room> {
    return rooms.filter(room => room.textRoom == true);
  }

}
