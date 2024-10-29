import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import AuthService from './services/auth.service';
import { TextTruncatePipe } from './pipes/text-truncate';

@NgModule({
  declarations: [TextTruncatePipe],
  imports: [CommonModule],
  exports: [TextTruncatePipe],
  providers: [AuthService]
})
export class CoreModule { }
