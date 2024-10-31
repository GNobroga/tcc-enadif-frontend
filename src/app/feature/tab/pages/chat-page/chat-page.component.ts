import { Component, HostListener, input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import ChatManagerService from 'src/app/core/services/chat-manager.service';
import { lastValueFrom } from 'rxjs';

export type ChatMessage = {
  fromId: string;
  displayName: string;
  message: string;
  sentAt: Date;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  queries: {
    chatMessages: new ViewChildren(ChatMessageComponent)
  }
})
export class ChatPageComponent implements ViewDidEnter, ViewWillLeave {

  @ViewChild(IonContent)
  ionContent: IonContent = {} as IonContent;

  isGlobal = input(false);

  chatMessages?: QueryList<ChatMessageComponent>;

  firstClick = signal(true);

  user = signal<User>({} as User);

  socket = signal({} as Socket);

  roomId = signal<string | null>(null);

  message = '';

  messages = signal<ChatMessage[]>([]);

  constructor(
    readonly auth: Auth,
    readonly route: ActivatedRoute,
    readonly chatManagerService: ChatManagerService,
  ) {}


  async ionViewDidEnter() {
      this.roomId.set(null);
      this.user.set(this.auth.currentUser!);
      if (this.isGlobal()) {
        this.startGlobalChat();
        return;
      } 
      const roomId = this.route.snapshot.params['roomId'] as string;
      const messages = await lastValueFrom(this.chatManagerService.listMessagesFromChat(roomId));
      this.messages.set(messages);

      this.scrollToEnd();
    
      this.roomId.set(roomId);
      const socket = io(`${environment.apiUrl}private-chat`, {
        auth: {
          token: await this.user().getIdToken(), 
        },
      });

      socket.on('connect', () => {
        socket.on('receive-message', (messages: ChatMessage[]) => {
          this.messages.set(messages);
          this.scrollToEnd();
        });
      }); 
      this.socket.set(socket);
  }


  private scrollToEnd() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(200);
    }, 100);
  }

  async ionViewWillLeave() {
      this.socket().close();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || this.message.trim() === '') return;
    this.sendSocketMessage(this.message);
  }

  sendMessage()  {
    if (this.message.trim() === '') return;
    this.sendSocketMessage(this.message);
  }

  private sendSocketMessage(message: string) {
    if (!this.isGlobal() && this.roomId()) {
      this.socket().emit('send-message', { roomId: this.roomId(), message: this.message, });
    } else {
      this.socket().emit('send-message', this.message);
    }

    this.message = '';
  }

  private async startGlobalChat() {
    const socket = io(`${environment.apiUrl}global-chat`, {
      auth: {
        token: await this.user().getIdToken(), 
      },
    });
    socket.on('connect', () => this.socket.set(socket));
    socket.on('receive-message', payload => {
      this.messages().push(payload);
      this.scrollToEnd();
    });
  }

  onScroll() {
    this.chatMessages?.forEach(chatMessage => chatMessage.menuClosed.set(true));
    this.firstClick.set(true);
  }

  @HostListener('click', ['$event'])
  onClick(event: PointerEvent) {
    const chatMessage = this.chatMessages?.find(chatMessage => !chatMessage.menuClosed());
    if (!chatMessage) {
      this.firstClick.set(true);
      return;
    }

    if (this.firstClick()) {
      this.firstClick.set(false);
      return;
    };

    const target = event.target as HTMLElement;

    const parent = chatMessage.chatMenu?.nativeElement;

    if (!parent) return;

    if (!this.targetEquals(parent, target)) {
      this.chatMessages?.forEach(chatMessage => chatMessage.menuClosed.set(true));
      this.firstClick.set(true);
    }
  }

  private targetEquals(el: Element, target: Element): boolean {
    if (el === target) return true;
    for (const child of Array.from(el.children)) {
      if (this.targetEquals(child, target)) {
        return true;
      }
    }
    return false;
  }

}
