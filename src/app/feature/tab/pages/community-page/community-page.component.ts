import { Component, computed, OnInit, signal } from '@angular/core';
import { MenuController } from '@ionic/angular';
import ChatManagerService, { ChatPrivate } from 'src/app/core/services/chat-manager.service';

@Component({
  selector: 'app-community-page',
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.scss'],
})
export class CommunityPage implements OnInit {

  countItems = new Array(10);

  readonly menuId = 'menu-community';

  privateChats = computed(() => this.chatManagerService.privateChats());
  
  constructor(
    readonly menuController: MenuController,
    readonly chatManagerService: ChatManagerService,
    
  ) { }
  
  ngOnInit(): void {
      this.chatManagerService.listPrivateChat().subscribe();
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
      return chats[0];
    } 
    return null;
  }

  getLastMessage(chat: ChatPrivate) {
    const messages = chat.messages ?? [];
    if (messages.length) return messages[0];
    throw new Error("Chat private doesn't have a message");
  }

}
