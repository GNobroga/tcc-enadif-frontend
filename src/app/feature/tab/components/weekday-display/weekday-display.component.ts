import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WeekdaySequenceDialogComponent } from '../weekday-sequence-dialog/weekday-sequence-dialog.component';
import UserService, { UserDaysSequence } from 'src/app/core/services/user.service';
import { ViewDidEnter } from '@ionic/angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-weekday-display',
  templateUrl: './weekday-display.component.html',
  styleUrls: ['./weekday-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekdayDisplayComponent  {

  daysSequence = input<UserDaysSequence>();

  constructor(
    readonly dialog: MatDialog,
    readonly userService: UserService,
    readonly router: Router,
  ) { }


  isMarked(day: number) {
    const sequence = this.daysSequence()?.days;
    if (!sequence) return false;
    if (day < 0 || day >= sequence.length) return false;
    return sequence[day];
  }

  canMarked(day: number) {
    const isMarked = this.isMarked(day);
    const previousDayIsMarked = this.isMarked(day - 1);
    const nextDayIsMarked = this.isMarked(day + 1);
    return isMarked && (previousDayIsMarked || nextDayIsMarked);
  }

  isStartWeek(day: number) {
    const sequence = this.daysSequence()?.days;
    if (!sequence) return false; 
    if (day < 0 || day >= sequence.length) return false;
    if (!this.isMarked(day)) return false;
    if (day === 0) return true;
    return !sequence[day - 1]; 
  }

  isBorderRemovable(day: number) {
    const sequence = this.daysSequence()?.days;
    if (!sequence) return false; 
    if (day < 0 || day >= sequence.length) return false;
    if (!this.isMarked(day)) return false;
    if (day >= 6) return false;
    return sequence[day + 1];
  }
  

  public openDialog() {
    this.dialog.open(WeekdaySequenceDialogComponent);
  }

}
