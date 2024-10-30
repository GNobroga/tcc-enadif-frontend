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

  get currentMonth() {
    const month = new Date().getMonth();
    switch(month) {
        case 0: return 'janeiro';
        case 1: return 'fevereiro';
        case 2: return 'março';
        case 3: return 'abril';
        case 4: return 'maio';
        case 5: return 'junho';
        case 6: return 'julho';
        case 7: return 'agosto';
        case 8: return 'setembro';
        case 9: return 'outubro';
        case 10: return 'novembro';
        case 11: return 'dezembro';
        default: return ''; 
    }
  }
  
  get currentDay() {
    return new Date().getDate();
  }

}
