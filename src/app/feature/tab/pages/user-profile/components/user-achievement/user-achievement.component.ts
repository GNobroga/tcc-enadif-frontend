import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Achievement } from 'src/app/core/services/achievement.service';

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrls: ['./user-achievement.component.scss'],
})
export class UserAchievementComponent  {

  @Input({ required: true })
  achievements: Achievement[] = [];

  @Output()
  toggleShowAvailables = new EventEmitter();

  constructor() { }



}
