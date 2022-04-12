import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MTDEmojiBackgroundComponent } from './mtd-emoji-background/mtd-emoji-background.component';
import { MTDErrorComponent } from './mtd-error/mtd-error.component';
import { MTDFooterComponent } from './mtd-footer/mtd-footer.component';
import { MTDRequestComponent } from './mtd-request/mtd-request.component';
import { MTDLoadingComponent } from './mtd-loading/mtd-loading.component';
import { REPModule } from 'src/app/lib/rep.module';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    MTDEmojiBackgroundComponent,
    MTDErrorComponent,
    MTDFooterComponent,
    MTDRequestComponent,
    MTDLoadingComponent,
  ],
  exports: [
    MTDEmojiBackgroundComponent,
    MTDErrorComponent,
    MTDFooterComponent,
    MTDRequestComponent,
    MTDLoadingComponent,
  ],
  imports: [
    CommonModule,
    REPModule,
    MatIconModule,
    DragDropModule,
  ]
})
export class MTDModule { }
