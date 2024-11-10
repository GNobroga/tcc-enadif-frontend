import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import AchievementService, { Achievement } from 'src/app/core/services/achievement.service';
import UserService, { UserDaysSequence, UserStats } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-achievement-view',
  templateUrl: './achievement-view.component.html',
})
export default class AchievementViewComponent implements OnInit {
  
  achievement!: Achievement;
  stats!: UserStats & UserDaysSequence;
  progress: number = 0;  // Variável para armazenar o progresso da conquista

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly achievementService: AchievementService,
    readonly userService: UserService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      const id = params['achievementId'];
      if (!id) {
        this.router.navigate(['/tabs/achievement']);
        return;
      }

      
      this.stats = {
        ...(await lastValueFrom(this.userService.getStats())),
        ...(await lastValueFrom(this.userService.getDaysSequence())),
      };

      this.achievement = await lastValueFrom(this.achievementService.findById(id));

      this.calculateProgress();
    });
  }

 
  calculateProgress() {
    const goal = this.achievement.goal;
    const type = this.achievement.type;
    

    switch (type) {
      case 'social':
        this.progress = (this.stats.countFriends / goal) * 100;
        break;

      case 'learning':
        this.progress = (this.stats.totalAnsweredQuestions / goal) * 100;
        break;

      case 'ranking':
        this.progress = (this.stats.score / goal) * 100;
        break;

      case 'no-error':
        this.progress = 0;  
        break;

      case 'no-wrong':
        this.progress = 0;  
        break;

      case 'trial-period':
        this.progress = this.stats.trialPeriod ? 100 : 0;
        break;

      case 'consecutive-days':
        const consecutiveDays = this.stats.days.filter(day => day).length; 
        this.progress = (consecutiveDays / goal) * 100;  
        break;

      default:
        this.progress = 0;
    }
    
    // Garante que a porcentagem não ultrapasse 100%
    this.progress = Math.min(this.progress, 100);
  }
}
