import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mtd-emoji-background',
  templateUrl: './mtd-emoji-background.component.html',
  styleUrls: ['./mtd-emoji-background.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MTDEmojiBackgroundComponent {

  public emojis: Array<string> = [
    "😀",
    "🍕",
    "😃",
    "🤡",
    "😅",
    "👽",
    "😇",
    "😈",
    "😉",
    "🍉",
    "😋",
    "😌",
    "😍",
    "🤬",
    "😏",
    "🤾",
    "🥝",
    "😒",
    "🥕",
    "🌮",
    "🎃",
    "🔥"
  ];

}
