import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SpeedDialModule } from 'primeng/speeddial';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [],
  imports: [PickerComponent],
  exports: [
    SelectButtonModule,
    SpeedDialModule,
    PickerComponent,
    InputGroupModule,
    OverlayPanelModule,
    CardModule,
    TagModule,
    ToggleButtonModule,
    TabViewModule,
    MenuModule,
    IconFieldModule,
    SplitButtonModule,
    InputIconModule,
    ChipModule,
    RippleModule,
    AvatarModule,
    MessagesModule,
    AvatarGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ToastModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
    ChartModule,
    CommonModule,
    ImageModule,
    EditorModule,
    FileUploadModule,
    ButtonModule,
    MatButtonModule,
    MatDialogModule,
    DividerModule,
    CarouselModule,
    BadgeModule
  ],
})
export class SharedModule {}
