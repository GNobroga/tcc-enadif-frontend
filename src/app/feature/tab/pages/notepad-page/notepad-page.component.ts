import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import NotepadService from 'src/app/core/services/notepad.service';

@Component({
  selector: 'app-notepad-page',
  templateUrl: './notepad-page.component.html',
  styleUrls: ['./notepad-page.component.scss'],
})
export class NotepadPageComponent implements OnInit {

  
  constructor(public readonly notepadService: NotepadService) {}
  
  notepads = this.notepadService.notepads;

  ngOnInit(): void {
    this.notepadService.listAll().subscribe();
  }

  getBackgroundColor(color: string) {
    return {
      backgroundColor: color,
    };
  }


}
