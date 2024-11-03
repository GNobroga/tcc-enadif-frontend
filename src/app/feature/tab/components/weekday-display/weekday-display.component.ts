import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WeekdaySequenceDialogComponent } from '../weekday-sequence-dialog/weekday-sequence-dialog.component';
import UserService, { UserDaysSequence } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-weekday-display',
  templateUrl: './weekday-display.component.html',
  styleUrls: ['./weekday-display.component.scss'],
})
export class WeekdayDisplayComponent implements OnInit  {

  daysSequence = signal<UserDaysSequence>({} as UserDaysSequence);

  constructor(
    readonly dialog: MatDialog,
    readonly userService: UserService,
  ) { }

  ngOnInit(): void {
      this.userService.getDaysSequence().subscribe(this.daysSequence.set);
  }

  isMarked(day: number) {
    const sequence = this.daysSequence()?.days;
    if (!sequence) return false;
    if (day < 0 || day >= sequence.length) return false;
    return sequence[day];
  }


  public openDialog() {
    this.dialog.open(WeekdaySequenceDialogComponent);
  }

}
