import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import QuizService, { Quiz } from 'src/app/core/services/quiz.service';
import { Question } from '../../components/quiz-question/quiz-question.component';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss'],
})
export class QuizSelectionComponent implements OnChanges {

  @Input()
  title!: string;

  @Input()
  cssClass!: string;

  @Input()
  category: 'logic' | 'computing' | 'software' | 'security' | 'infrastructure' | null = null;

  quizzes = signal([] as Quiz[]);

  isLoading = signal(false);

  // coloca um input type pra identifacar a categoria as provas delas

  constructor(
    readonly quizService: QuizService,
  ) { }

  ngOnChanges() {
      if (!this.category) return;
      this.isLoading.set(true);
      this.quizService.listByCategoryName(this.category)
        .subscribe(quizzes => {
          this.quizzes.set(quizzes);
          this.isLoading.set(false);
        });
  }

  getCountQuestionsDone(questions: Question[]) {
    return questions.filter(({ done }) => done)
      .length;
  }

  getTimeSpent(quiz: Quiz): string {
    const [hour, minutes, seconds] = quiz.timeSpent;
    let text = '';
    
    if (hour > 0) {
      text = `${hour.toString().padStart(2, '0')}h`;
    }
    
    text += ` ${minutes.toString().padStart(2, '0')}m`;
    text += ` ${seconds.toString().padStart(2, '0')}s`;

    return text;
  }
}