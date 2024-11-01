import { Component, computed, DoCheck, effect, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonMenu, MenuController, SearchbarChangeEventDetail, ViewDidEnter } from '@ionic/angular';
import ChatManagerService, { ChatPrivate } from 'src/app/core/services/chat-manager.service';
import * as removeAccents from 'remove-accents';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Auth } from '@angular/fire/auth';

// friendId,
// friendName: friend.displayName,
// photoUrl: friend.photoURL,
// lastRefreshTime: friend.metadata.lastRefreshTime,
// status: this.connectedUsers.has(friend.uid),

export type FriendInfo = {
  friendId: string;
  friendName: string;
  photoUrl: string;
  lastRefreshTime: Date;
  status: boolean;
}

@Component({
  selector: 'app-community-page',
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.scss'],
})
export class CommunityPage implements ViewDidEnter, OnInit{

  countItems = new Array(10);

  @ViewChild('menu')
  ionMenu!: IonMenu;

  readonly menuId = 'menu-community';

  isLoading = signal(false);

  isFriendInfoLoading = signal(false);

  privateChats = computed(() => this.chatManagerService.privateChats());

  socket = signal<Socket | null>(null);

  searchByName = new FormControl('');

  searchByName2 = new FormControl('');

  cacheListPrivateChat = signal([] as ChatPrivate[]);

  cacheListFriendInfo = signal([] as FriendInfo[]);

  friends = signal<FriendInfo[]>([]);

  constructor(
    readonly menuController: MenuController,
    readonly chatManagerService: ChatManagerService,
    readonly router: Router,
    readonly auth: Auth
  ) {
    
   }

  ionViewDidEnter(): void {
    this.isLoading.set(true);
    this.isFriendInfoLoading.set(true);
    this.chatManagerService.listPrivateChat().subscribe(() => {
      this.cacheListPrivateChat.set(this.chatManagerService.privateChats());
      this.isLoading.set(false);
    });
  }

  async ngOnInit() {
      const socket = io(`${environment.apiUrl}user-notification`, {
        auth: {
          token: await this.auth.currentUser?.getIdToken(),
        },
      });

      this.socket.set(socket);
  
      socket.on('connect', () => {
        socket.emit('list-friends');
        socket.on('list-friends', payload => {
          this.friends.set(payload);
          if (this.isFriendInfoLoading()) {
            this.cacheListFriendInfo.set(payload);
          }
          this.isFriendInfoLoading.set(false);
        });
      })

      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.chatManagerService.listPrivateChat().subscribe(() => {
            this.cacheListPrivateChat.set(this.chatManagerService.privateChats());
            this.isLoading.set(false);
            this.ionMenu.close();
          });
      });
      this.searchByName.valueChanges.subscribe(data => {
        if (!data && data?.trim() === '') {
          this.cacheListPrivateChat.set(this.privateChats());
        } else {
          this.cacheListPrivateChat.update(oldValue => 
            oldValue.filter(({ participantTwo }) => {
              const displayName = removeAccents(participantTwo.displayName!).toLowerCase();
              return displayName.includes(removeAccents(data!.toLowerCase()));
            }));
        }
      });
      this.searchByName2.valueChanges.subscribe(data => {
        if (!data && data?.trim() === '') {
          this.cacheListFriendInfo.set(this.friends());
        } else {
          this.cacheListFriendInfo.set(
            this.friends().filter(({ friendName }) => {
              return removeAccents(friendName.toLowerCase()).includes(removeAccents(data!.toLowerCase()));
            }));
          }
      });
  }

  createPrivateChat(friendId: string) {
    this.chatManagerService.createPrivateChat(friendId).subscribe(({ roomId }) => {
      this.router.navigate(['/tabs/friend-chat', roomId]);
    });
  }

  showMenu() {
    this.menuController.open(this.menuId);
  }

  closeMenu() {
    this.menuController.close(this.menuId);
  }

  get lastMessage() {
    const chats = this.privateChats();
    if (chats && chats.length) {
      return chats[chats.length - 1];
    } 
    return null;
  }

  getLastMessage(chat: ChatPrivate) {
    const messages = chat.messages ?? [];
    if (messages.length) return messages[0];
    throw new Error("Chat private doesn't have a message");
  }

}
