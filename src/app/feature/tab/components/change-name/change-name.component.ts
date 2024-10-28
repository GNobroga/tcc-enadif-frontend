import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.scss'],
})
export class ChangeNameComponent implements OnInit {

  newName = '';

  constructor(
    readonly dynamicDialogRef: DynamicDialogRef,
    readonly dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
      this.newName = this.dynamicDialogConfig.data.displayName;
  }

  confirm() {
    this.dynamicDialogRef.close(this.newName);
  }

}
