import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserStats } from 'src/app/core/services/user.service';
import { Question } from 'src/app/feature/quiz/components/quiz-question/quiz-question.component';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent {

  @Input({ required: true })
  userStats!: UserStats;

  constructor(
    readonly route: ActivatedRoute,
  ) { }

    calculateAccuracyRate(stats: UserStats): number {
      const { totalAnsweredQuestions, correctAnswersCount } = stats;

      if (totalAnsweredQuestions === 0) {
          return 0; 
      }

      const accuracyRate = (correctAnswersCount / totalAnsweredQuestions) * 100;

      return parseFloat(accuracyRate.toFixed(2)); 
  }

  calculateCategoryPercent(category: string) {
    const correctAnswersForCategory = this.userStats.correctAnswersByCategory[category];
    const totalCorrectAnswers = this.userStats.correctAnswersCount;
  
    if (totalCorrectAnswers === 0) {
      return 0; 
    }
  
    return Math.floor((correctAnswersForCategory / totalCorrectAnswers) * 100);
  }
  


}
