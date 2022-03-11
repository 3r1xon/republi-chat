import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { REPChatComponent } from 'src/app/lib/rep-chat/rep-chat.component';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import { Room } from 'src/interfaces/channel.interface';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
@Unsubscriber
export class ChatComponent {

  constructor(
    public _ms: MessagesService,
    public _utils: UtilsService
  ) { }

  @ViewChild(REPChatComponent) private chat: REPChatComponent;

  private prevRoom: Room;

  protected readonly messageSubscription: Subscription = this._ms.roomChanges
    .subscribe(() => {

      // Ensures each room chat maintains the text
      // that is not sent yet
      if (this.prevRoom) {
        this.prevRoom.draft = this.chat.getText();

        if (this._ms.currentRoom.draft) {
          this.chat.setText(this._ms.currentRoom.draft);
        } else {
          this.chat.setText(null);
        }
      }

      this.prevRoom = this._ms.currentRoom;

      this.chat.reset();
    });

  public readonly msgOptions: Array<REPButton> = [
    {
      name: "Edit",
      icon: "edit",
      visible: (msgIndex: number) => this._ms.messages[msgIndex].auth,
      onClick: (msgIndex: number) => {
      }
    },
    {
      name: "Report",
      icon: "flag",
      visible: (msgIndex: number) => !this._ms.messages[msgIndex].auth,
      onClick: (msgIndex: number) => {
      }
    },
    {
      name: "Highlight",
      icon: "star",
      onClick: (msgIndex: number) => {
        this._ms.highlightMessage(this._ms.messages[msgIndex].id);
      }
    },
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      visible: (msgIndex: number) => {
        if (this._ms.messages[msgIndex].auth) {
          return true;
        }

        return this._ms.roomPermissions.deleteMessages;
      },
      onClick: (msgIndex: number) => {
        this._utils.showRequest("Delete message", "Are you sure you want to delete this message?", () => {
          this._ms.deleteMessage(this._ms.messages[msgIndex].id);
        });
      }
    },
    {
      name: "Kick",
      icon: "remove_circle_outline",
      color: "warning",
      visible: (msgIndex: number) => {
        if (this._ms.messages[msgIndex].auth) {
          return false;
        }

        return this._ms.chPermissions.kickMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._ms.messages[msgIndex];

        this._utils.showRequest(`Kick ${msg.name}`, `Are you sure you want to kick out ${msg.name}? He will be able to rejoin later...`, () => {

        });
      }
    },
    {
      name: "Ban",
      icon: "delete_forever",
      color: "danger",
      visible: (msgIndex: number) => {
        if (this._ms.messages[msgIndex].auth) {
          return false;
        }

        return this._ms.chPermissions.banMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._ms.messages[msgIndex];

        this._utils.showRequest(
          `Ban ${msg.name}`,
          `Are you sure you want to ban ${msg.name}? He will NOT be able to rejoin later till his ban is revoked!`,
          () => {
            this._ms.banUser(this._ms.currentChannel, msg.author);
          }
        );
      }
    }
  ];

  public readonly chatOptions: Array<REPButton> = [
    {
      name: "Delete messages",
      icon: "delete_sweep",
      tooltip: "Deletes selected messages",
      background: "danger",
      visible: () => this.chat?.selections.length > 0,
      enabled: () => {
        if (this._ms.roomPermissions.deleteMessages)
          return true;
        return !this.chat.selections.some((msg: Message) => msg.auth == false);
      },
      onClick: () => {
        const selNum = this.chat.selections.length;

        const delSelected = () => {
          this.chat.selections.map((msg: Message) => {
            this._ms.deleteMessage(msg.id);
          })
          this.chat.deselectAll();
        }

        this._utils.showRequest(`Delete ${selNum} messages?`, `Are you sure you want to delete ${selNum} messages?`, delSelected);
      }
    },
    {
      name: "Deselect",
      icon: "clear_all",
      tooltip: "Deselect all",
      background: "warning",
      visible: () => this.chat?.selections.length > 0,
      onClick: () => {
        this.chat.deselectAll();
      }
    }
  ];

  textboxPermissionsHandler(): boolean {

    if (this._ms.roomPermissions?.sendMessages == null) {

      if (this._ms.chPermissions?.sendMessages == true)
        return true;
    } else {

      if (this._ms.roomPermissions?.sendMessages == true)
        return true;
    }

    return false;
  }

  displayChatName() {
    if (!this._ms.currentChannel?.name)
      return '';

    return this._ms.currentChannel?.name + " - " + this._ms.currentRoom?.roomName;
  }

  sendChannelMessage(message: string) {
    this._ms.sendMessage(message);
  }

}
