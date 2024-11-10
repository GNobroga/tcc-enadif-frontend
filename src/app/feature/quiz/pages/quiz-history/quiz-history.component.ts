import { Component } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import QuizService, { QuizHistory } from 'src/app/core/services/quiz.service';

@Component({
  selector: 'app-quiz-history',
  templateUrl: './quiz-history.component.html',
  styleUrls: ['./quiz-history.component.scss'],
})
export class QuizHistoryComponent implements ViewDidEnter {

  constructor(
    readonly quizService: QuizService,
  ) { }

  quizzes: QuizHistory[] = [];
  isLoading = false;

  ionViewDidEnter() {
      this.isLoading = true;
      this.quizService.listHistory().subscribe(result => {
        console.log(result)
        this.quizzes = result;
        this.isLoading = false;
      });
  }

  formatTime(timeArray: [number, number, number]): string {
    timeArray ||= [0, 0, 0];
    const [hours, minutes, seconds] = timeArray;
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }


  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


}
