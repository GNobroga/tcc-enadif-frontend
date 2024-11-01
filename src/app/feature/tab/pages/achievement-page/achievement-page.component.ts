import { Component, OnInit, signal } from '@angular/core';
import { SegmentCustomEvent } from '@ionic/angular';
import AchievementService, { Achievement } from 'src/app/core/services/achievement.service';

@Component({
  selector: 'app-achievement-page',
  templateUrl: './achievement-page.component.html',
  styleUrls: ['./achievement-page.component.scss'],
})
export class AchievementPageComponent  implements OnInit {
  
  
  constructor(
    public readonly achievementService: AchievementService,
  ) { }
  
  achievements = this.achievementService.achievements;
  cacheAchievements = signal<Achievement[]>([]);

  ngOnInit() {
    this.achievementService.listAll().subscribe(() => {
      this.cacheAchievements.set(this.achievements());
    });
  }

  onChange(event: SegmentCustomEvent) {
      if (event.detail.value === 'default') {
        this.cacheAchievements.set(this.achievements());
      } else if (event.detail.value === 'acquired') {
        this.cacheAchievements.update(() => this.achievements().filter(({ acquired }) => acquired));
      }
  }

}
