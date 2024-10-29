import { Component, effect, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { INotepad } from 'src/app/core/interfaces/notepad';
import NotepadService from 'src/app/core/services/notepad.service';

@Component({
  selector: 'app-create-note-page',
  templateUrl: './create-note-page.component.html',
  styleUrls: ['./create-note-page.component.scss'],
})
export class CreateNotePageComponent implements ViewDidEnter {
  public readonly colorButtons = [
    'cadetblue',
    'cornflowerblue',
    'darkseagreen',
    'mediumseagreen',
    'mediumslateblue',
    'rosybrown',
    'lightcoral',
    'darkkhaki',
    'goldenrod',
    'lightsteelblue',
    'mediumpurple',
    'darksalmon',
    'peru',
    'tan',
    'indianred',
    'lightseagreen'
  ];

  public headerColor = signal(this.colorButtons[0]);

  form = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
  });

  notepad = signal<INotepad | null>(null);

  constructor(
    readonly route: ActivatedRoute,
    readonly notepadService: NotepadService
  ) { }

  ionViewDidEnter(): void {
    const notepadId = this.route.snapshot.queryParams['existingId'];
    if (notepadId) {
      this.notepadService.findById(notepadId)
        .subscribe(result => {
          const notepad = result as INotepad;
          this.notepad.set(notepad);
          this.changeColor(notepad.color);
          this.form.patchValue(notepad);
        });
    }
  }

  public changeColor(color: string) {
    this.headerColor.set(color);
  }

}
