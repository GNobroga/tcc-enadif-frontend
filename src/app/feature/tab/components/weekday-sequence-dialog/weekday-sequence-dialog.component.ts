import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import UserService from 'src/app/core/services/user.service';

@Component({
  selector: 'app-weekday-sequence-dialog',
  templateUrl: './weekday-sequence-dialog.component.html',
  styleUrls: ['./weekday-sequence-dialog.component.scss'],
})
export class WeekdaySequenceDialogComponent  implements OnInit {

  listMarkedDays: boolean[] = [];
  numberOfOffensives: number = 0;

  constructor(
    readonly userService: UserService,
  ) { }

  async ngOnInit() {
    const { days, numberOfOffensives } = await lastValueFrom(this.userService.getDaysSequence());
    this.listMarkedDays = days;
    this.numberOfOffensives = numberOfOffensives;
  }

  isDayMarked(day: number) {
    if (!this.listMarkedDays.length || this.listMarkedDays.length !== 7) return false;
    return this.listMarkedDays[day];
  }

}
