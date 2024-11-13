import { Component, effect, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import AchievementService from 'src/app/core/services/achievement.service';
import UserFriendService from 'src/app/core/services/user-friend.service';
import UserService, { UserStats } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit  {

  items: MenuItem[] = [
    {
      id: 'add-friend',
      label: 'Adicionar amigo',
      command: async () => {
        if (!this.profileId()) return;
        this.userFriendService.sendRequestFriend(this.profileId())
          .pipe(catchError(err => {
            this.messageService.add({severity: 'warn', detail: err.error.message, });
            return throwError(() => err);
          }))
          .subscribe(() => {
              this.messageService.add({severity: 'info', summary: 'Solicitação', detail: 'enviada com sucesso!'});
          });
      },
    },
    {
      id: 'remove-friend',
      label: 'Remover amigo',
      command: () => {
        this.userFriendService.removeFriend(this.profileId()).subscribe(async payload => {
          const { removed } = payload as any;
          if (removed) {
            this.messageService.add({severity: 'success', summary: 'Exclusão', detail: 'removido com sucesso!'});
          } else {
            this.messageService.add({severity: 'error', summary: 'Exclusão', detail: 'Vocês não são amigos'});
          }
          await this.loadCheckIfTheyFriends(this.profileId());
        });
      },
    },
  ];

  cacheMenuItems = signal([] as MenuItem[]);

  profileId = signal<string>('');
  
  userStats!: UserStats;

  countAchievements = 0;

  constructor(
    readonly messageService: MessageService,
    readonly route: ActivatedRoute,
    readonly auth: Auth,
    readonly router: Router,
    readonly userFriendService: UserFriendService,
    readonly userService: UserService,
    readonly achievementService: AchievementService,
  ) {}

  currentUser = signal(this.auth.currentUser);

  isFriend = signal(false);

  isLoading = false;

  async ngOnInit() {
      this.isLoading = true;
      this.route.params.subscribe(async params => {
        const { id } = params;
        if (id === this.currentUser()?.uid) {
          this.router.navigate(['/tabs']);
          return;
        }
        this.profileId.set(id);
        await this.loadCheckIfTheyFriends(id);
        this.userStats = await lastValueFrom(this.userService.getStatsByOwnerId(id));
        const { count } = await lastValueFrom(this.achievementService.countAcquired());
        this.countAchievements = count;

        this.isLoading = false;
      });
  }

  async loadCheckIfTheyFriends(friendId: string) {
    const { friend } = await this.userFriendService.checkIfTheyFriends(friendId);
    if (!friend) {
      this.cacheMenuItems.set(this.items.filter(item => item.id === 'add-friend'));
    } else {
      this.cacheMenuItems.set(this.items.filter(item => item.id === 'remove-friend'));
    }
  }


}
