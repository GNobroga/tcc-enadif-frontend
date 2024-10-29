import { Component, DoCheck, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { AlertButton, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { debounceTime, forkJoin, Subject, takeUntil } from 'rxjs';
import { INotepad } from 'src/app/core/interfaces/notepad';
import NotepadService from 'src/app/core/services/notepad.service';

@Component({
  selector: 'app-create-note-page',
  templateUrl: './create-note-page.component.html',
  styleUrls: ['./create-note-page.component.scss'],
  providers: [MessageService],
})
export class CreateNotePageComponent implements OnInit, ViewDidEnter, ViewDidLeave, OnDestroy {
  
  
  constructor(
    readonly route: ActivatedRoute,
    readonly notepadService: NotepadService,
    readonly messageService: MessageService,
    readonly router: Router
  ) { }

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

  subject = new Subject();

  public headerColor = signal(this.colorButtons[0]);

  form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(2000)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
  });

  notepad = signal<INotepad | null>(null);

  alertButtons: AlertButton[] = [
    {
      text: 'Cancelar',
      handler: () => console.log('cancelar'),  
    },
    {
      text: 'Confirmar',
      handler: () => this.notepadService.deleteById(this.notepad()?.id!)
        .subscribe(() => {  
          this.router.navigate(['tabs', 'notes']);
        }),
    },
  ];

  ngOnInit(): void {
    this.form.controls.title.valueChanges.pipe(
        debounceTime(1), 
        takeUntil(this.subject))
        .subscribe(() => this.validateForm());
      
    this.form.controls.description.valueChanges.pipe(
        debounceTime(1), 
        takeUntil(this.subject))
        .subscribe(() => this.validateForm());
  }

  ngOnDestroy(): void {
      this.subject.next(null);
      this.subject.unsubscribe();
  }

  ionViewDidEnter(): void {
    const sourceId = this.route.snapshot.queryParams['sourceId'];
    if (sourceId) {
      this.notepadService.findById(sourceId)
        .pipe(takeUntil(this.subject))
        .subscribe(result => this.setNotepad(result as INotepad));
    }
  }

  ionViewDidLeave() {
    if (this.form.invalid) return;
    const { title, description } = this.form.value as { title: string, description: string };
    const color = this.headerColor();
    const note = this.notepad();
    if (note) {
      this.notepadService.update(note.id, { title, description, color }).subscribe();
    } else {
      this.notepadService.create({
        title, 
        description,
        color,
      }).subscribe();
    }
  }

  private validateForm() {
    const controls = this.form.controls;
    if (controls.title.hasError('maxlength')) {
      const { requiredLength,} = controls.title.getError('maxlength');
      this.messageService.add({
        severity: 'info',
        detail: `O título não pode ser maior que ${requiredLength}`,
      });
    }

    if (controls.description.hasError('maxlength')) {
      const { requiredLength,} = controls.description.getError('maxlength');
      this.messageService.add({
        severity: 'info',
        detail: `O descrição não pode ser maior que ${requiredLength}`,
      });
    }
  }

  private setNotepad(src: INotepad) {
    this.notepad.set(src);
    this.changeColor(src.color);
    this.form.patchValue(src);
  }

  public changeColor(color: string) {
    this.headerColor.set(color);
  }

}
