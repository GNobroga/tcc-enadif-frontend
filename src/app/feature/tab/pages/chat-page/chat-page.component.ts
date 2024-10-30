import { Component, HostListener, input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { IonContent, ViewDidEnter } from '@ionic/angular';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

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
export class ChatPageComponent implements ViewDidEnter {

  @ViewChild(IonContent)
  ionContent: IonContent = {} as IonContent;

  isGlobal = input(false);

  chatMessages?: QueryList<ChatMessageComponent>;

  firstClick = signal(true);

  user = signal<User>({} as User);

  socket = signal({} as Socket);

  message = '';

  messages = signal<ChatMessage[]>([]);

  constructor(
    readonly auth: Auth
  ) {}


  ionViewDidEnter(): void {
      this.user.set(this.auth.currentUser!);
      if (this.isGlobal()) {
        this.startGlobalChat();
      }
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
    this.socket().emit('send-message', this.message);
    this.message = '';
    setTimeout(() => {
      this.ionContent.scrollToBottom(200);
    }, 100);
  }

  private async startGlobalChat() {
    const socket = io(`${environment.apiUrl}global-chat`, {
      auth: {
        token: await this.user().getIdToken(), 
      },
    });
    this.socket.set(socket);
    socket.on('receive-message', payload => this.messages().push(payload));
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

    const parent = chatMessage.chatMenu.nativeElement;

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
