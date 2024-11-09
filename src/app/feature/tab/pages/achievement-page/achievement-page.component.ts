import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { SegmentCustomEvent } from '@ionic/angular';
import AchievementService, { Achievement } from 'src/app/core/services/achievement.service';

@Component({
  selector: 'app-achievement-page',
  templateUrl: './achievement-page.component.html',
  styleUrls: ['./achievement-page.component.scss'],
})
export class AchievementPageComponent  implements OnInit {

  constructor(
    readonly achievementService: AchievementService,
    readonly auth: Auth,
  ) { }

  currentUser = signal(this.auth.currentUser!);
  
  achievements = this.achievementService.achievements;
  cacheAchievements = signal<Achievement[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.isLoading.set(true);
    this.achievementService.listAll(this.currentUser().uid).subscribe(() => {
      this.cacheAchievements.set(this.achievements());
      this.isLoading.set(false);
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
