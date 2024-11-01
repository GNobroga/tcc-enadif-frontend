import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import UserFriendService from 'src/app/core/services/user-friend.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit  {

  readonly items: MenuItem[] = [
    {
      label: 'Adicionar amigo',
      command: () => {
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
      label: 'Remover amigo',
      command: () => {
        this.userFriendService.removeFriend(this.profileId()).subscribe(payload => {
          const { removed } = payload as any;
          if (removed) {
            this.messageService.add({severity: 'success', summary: 'Exclusão', detail: 'removido com sucesso!'});
          } else {
            this.messageService.add({severity: 'error', summary: 'Exclusão', detail: 'Vocês não são amigos'});
          }
        });
      },
    },
  ];

  profileId = signal<string>('');

  constructor(
    readonly messageService: MessageService,
    readonly route: ActivatedRoute,
    readonly auth: Auth,
    readonly router: Router,
    readonly userFriendService: UserFriendService,
  ) { }

  currentUser = signal(this.auth.currentUser);

  async ngOnInit() {
      this.route.params.subscribe(params => {
        const { id } = params;
        if (id === this.currentUser()?.uid) {
          this.router.navigate(['/tabs']);
          return;
        }
        this.profileId.set(id);
      });
  }

}
