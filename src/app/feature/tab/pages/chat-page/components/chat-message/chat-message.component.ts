import { AfterViewChecked, Component, effect, ElementRef, HostListener, input, Input, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { ChatMessage, ChatPageComponent } from '../../chat-page.component';
import ChatMenuComponent from '../chat-menu/chat-menu.component';
import ChatManagerService from 'src/app/core/services/chat-manager.service';

export interface ChatMessageMenuItem {
  label: string;
  command: () => void;
}

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  queries: {
    chatMenu: new ViewChild(ChatMenuComponent, { read: ElementRef }),
  }
})
export class ChatMessageComponent implements OnInit{

  @Input()
  public isOwnMessage = false;

  menuClosed = signal(true);

  chatMenu!: ElementRef<HTMLElement>;

  @Input({ required: true, })
  payload: ChatMessage = {} as ChatMessage;

  items: ChatMessageMenuItem[] = [
    {
      label: 'Ver perfil',
      command: () => {
        this.menuClosed.set(true);
        this.router.navigate(['tabs', 'profile']);
      },
    },
    {
      label: 'Bate papo',
      command: () => {
        this.chatManagerService.createPrivateChat(this.payload.fromId).subscribe(({ roomId }) => {
          this.router.navigate(['/tabs/friend-chat', roomId]);
        });
      },
    },
  ];

  constructor(
    readonly router: Router,
    readonly parent: ChatPageComponent,
    readonly chatManagerService: ChatManagerService
  ) {
    effect(() => {
      if (!this.menuClosed()) {
        this.parent.chatMessages?.forEach(chatMessage => {
          if (this !== chatMessage) {
            chatMessage.menuClosed.set(true);
            this.parent.firstClick.set(true);
          }

        });
      }
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {
      if (!this.parent.isGlobal()) {
        this.items = [
          {
            label: 'Ver perfil',
            command: () => {
              this.menuClosed.set(true);
              this.router.navigate(['tabs', 'profile']);
            },
          },
        ];
      }
  }
}
