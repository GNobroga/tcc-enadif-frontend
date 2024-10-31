import { Component, computed, DoCheck, effect, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuController, SearchbarChangeEventDetail, ViewDidEnter } from '@ionic/angular';
import ChatManagerService, { ChatPrivate } from 'src/app/core/services/chat-manager.service';
import * as removeAccents from 'remove-accents';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-community-page',
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.scss'],
})
export class CommunityPage implements ViewDidEnter, OnInit{

  countItems = new Array(10);

  readonly menuId = 'menu-community';

  isLoading = signal(false);

  privateChats = computed(() => this.chatManagerService.privateChats());

  searchByName = new FormControl('');

  cacheListPrivateChat = signal([] as ChatPrivate[]);

  constructor(
    readonly menuController: MenuController,
    readonly chatManagerService: ChatManagerService,
    readonly router: Router
  ) {
    
   }

  ionViewDidEnter(): void {
    this.isLoading.set(true);
    this.chatManagerService.listPrivateChat().subscribe(() => {
      this.cacheListPrivateChat.set(this.chatManagerService.privateChats());
      this.isLoading.set(false);
    });
  }

  ngOnInit(): void {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.chatManagerService.listPrivateChat().subscribe(() => {
            this.cacheListPrivateChat.set(this.chatManagerService.privateChats());
            this.isLoading.set(false);
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
