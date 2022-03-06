import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { REPChatComponent } from 'src/app/lib/rep-chat/rep-chat.component';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(
    public _msService: MessagesService,
    public _utils: UtilsService
  ) { }

  @ViewChild(REPChatComponent) private chat: REPChatComponent;

  protected readonly messageSubscription: Subscription = this._msService.messages$
    .subscribe(() => {
      this.chat.reset();
    });

  public readonly msgOptions: Array<REPButton> = [
    {
      name: "Edit",
      icon: "edit",
      visible: (msgIndex: number) => this._msService.messages[msgIndex].auth,
      onClick: (msgIndex: number) => {
      }
    },
    {
      name: "Report",
      icon: "flag",
      visible: (msgIndex: number) => !this._msService.messages[msgIndex].auth,
      onClick: (msgIndex: number) => {
      }
    },
    {
      name: "Highlight",
      icon: "star",
      onClick: (msgIndex: number) => {
        this._msService.highlightMessage(this._msService.messages[msgIndex].id);
      }
    },
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return true;
        }

        return this._msService.roomPermissions.deleteMessages;
      },
      onClick: (msgIndex: number) => {
        this._utils.showRequest("Delete message", "Are you sure you want to delete this message?", () => {
          this._msService.deleteMessage(this._msService.messages[msgIndex].id);
        });
      }
    },
    {
      name: "Kick",
      icon: "remove_circle_outline",
      color: "warning",
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return false;
        }

        return this._msService.chPermissions.kickMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._msService.messages[msgIndex];

        this._utils.showRequest(`Kick ${msg.name}`, `Are you sure you want to kick out ${msg.name}? He will be able to rejoin later...`, () => {

        });
      }
    },
    {
      name: "Ban",
      icon: "delete_forever",
      color: "danger",
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return false;
        }

        return this._msService.chPermissions.banMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._msService.messages[msgIndex];

        this._utils.showRequest(
          `Ban ${msg.name}`,
          `Are you sure you want to ban ${msg.name}? He will NOT be able to rejoin later till his ban is revoked!`,
          () => {
            this._msService.banUser(this._msService.currentChannel, msg.author);
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
        if (this._msService.roomPermissions.deleteMessages)
          return true;
        return !this.chat.selections.some((msg: Message) => msg.auth == false);
      },
      onClick: () => {
        const selNum = this.chat.selections.length;

        const delSelected = () => {
          this.chat.selections.map((msg: Message) => {
            this._msService.deleteMessage(msg.id);
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

    if (this._msService.roomPermissions?.sendMessages == null) {

      if (this._msService.chPermissions?.sendMessages == true)
        return true;
    } else {

      if (this._msService.roomPermissions?.sendMessages == true)
        return true;
    }

    return false;
  }

  displayChatName() {
    if (!this._msService.currentChannel?.name)
      return '';

    return this._msService.currentChannel?.name + " - " + this._msService.currentRoom?.roomName;
  }

  sendChannelMessage(message: string) {
    this._msService.sendMessage(message);
  }

}
