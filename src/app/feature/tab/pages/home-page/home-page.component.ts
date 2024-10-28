import { Component, OnInit, signal } from '@angular/core';
import { register } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { WeekdaySequenceDialogComponent } from '../../components/weekday-sequence-dialog/weekday-sequence-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Auth, User } from '@angular/fire/auth';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  user = signal<User | null>(null);

  constructor(
    public readonly dialog: MatDialog,
    public readonly auth: Auth
  ) { }

  ngOnInit(): void {
    this.user.set(this.auth.currentUser);
  }

  public openWeekdaySequenceDialog() {
    this.dialog.open(WeekdaySequenceDialogComponent);
  }

  get firstName() {
    const displayName = this.user()?.displayName ?? '';
    return displayName.split(' ')[0];
  }

}
