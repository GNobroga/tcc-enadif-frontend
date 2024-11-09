import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Query, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { WeekdaySequenceDialogComponent } from '../../components/weekday-sequence-dialog/weekday-sequence-dialog.component';
import { filter } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import UserService from 'src/app/core/services/user.service';
import UserFriendService from 'src/app/core/services/user-friend.service';
import { MessageService } from 'primeng/api';
import AchievementService from 'src/app/core/services/achievement.service';
import { ViewDidEnter } from '@ionic/angular';
import { DialogService } from 'primeng/dynamicdialog';
import AcquiredAchievementComponent from '../achievement-page/components/acquired-achievement/acquired-achievement.component';


export type UserFriendNotification = {
  id: string;
  userName: string;
  userId: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  queries: {
    overlayPanel: new ViewChild(OverlayPanel),
  },
  providers: [MessageService, DialogService],
})
export class HomePageComponent implements OnInit {

  user = signal<User | null>(null);

  overlayPanel: OverlayPanel = {} as OverlayPanel;

  listFriendNotification = signal([] as UserFriendNotification[]);
  
  socket = signal<Socket | null>(null);

  achievementAcquiredCount = signal(0);

  constructor(
    readonly dialog: MatDialog,
    readonly auth: Auth,
    readonly router: Router,
    readonly changeDetectorRef: ChangeDetectorRef,
    readonly userFriendService: UserFriendService,
    readonly messageService: MessageService,
    readonly achievementService: AchievementService,
    readonly dialogService: DialogService,
  ) {
      
  }  

  async ngOnInit() {
    this.achievementService.countAcquired().subscribe(({ count }) => {
      this.achievementAcquiredCount.set(count);
    });
    this.user.set(this.auth.currentUser);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async () => {

        this.achievementService.check()
        .subscribe(({ hasNew }) => {
          if (!hasNew) return;
          this.dialogService.open(AcquiredAchievementComponent, {
            styleClass: 'w-[90vw] !m-0 !p-0',
            modal: true,
          });
          this.ngOnInit();
        });
        

        this.achievementService.countAcquired().subscribe(({ count }) => {
          this.achievementAcquiredCount.set(count);
        });

        this.socket()?.close();
        this.overlayPanel?.hide();
        this.changeDetectorRef.detectChanges();
        const socket = io(`${environment.apiUrl}user-notification`, {
          auth: {
            token: await this.user()?.getIdToken(),
          }
        });
        this.socket.set(socket);
        socket.on('connect', () => {
          socket.emit('list-friend-notifications');
          socket.on('receive-friend-notification', this.listFriendNotification.set);
        });
      });
  }

  sendFriendRequest(requestId: string) {
    this.userFriendService.acceptRequest(requestId).subscribe(() => {
      this.overlayPanel?.hide();
      this.messageService.add({
        severity: 'success',
        detail: 'Você aceitou a solicitação de amizade',
      });
    });
  }

  rejectFriendRequest(requestId: string) {
    this.userFriendService.rejectRequest(requestId).subscribe(() => {
      this.overlayPanel?.hide();
        this.messageService.add({
          severity: 'info',
          detail: 'Você recusou a solicitação de amizade',
        });
      });
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
