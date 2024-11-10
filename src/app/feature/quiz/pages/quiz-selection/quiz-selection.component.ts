import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import QuizService, { Quiz } from 'src/app/core/services/quiz.service';
import { Question } from '../../components/quiz-question/quiz-question.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss'],
})
export class QuizSelectionComponent implements OnChanges, OnInit {

  @Input()
  title!: string;

  @Input()
  cssClass!: string;

  @Input()
  category: 'logic' | 'computing' | 'software' | 'security' | 'infrastructure' | null = null;

  quizzes = signal([] as Quiz[]);

  isLoading = signal(false);


  constructor(
    readonly quizService: QuizService,
    readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
      this.route.url.subscribe(() => {
        this.loadQuizzes();
      });
  }

  ngOnChanges() {
      this.loadQuizzes();
  }

  getBackground() {
    if (this.category === 'logic') return 'bg-gradient-to-l from-[#ffb429] to-[#f15c17]';
    return '';
  }

  getProgressBarColor(completed: number, total: number): string {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'bg-green-500';  
    if (percentage >= 50) return 'bg-yellow-500';   
    return 'bg-red-500';  
  }

  private loadQuizzes() {
    if (!this.category) return;
      this.isLoading.set(true);
      this.quizService.listByCategoryName(this.category)
        .subscribe(quizzes => {
          this.quizzes.set(quizzes);
          this.isLoading.set(false);
        });
  }

  getCountQuestionsDone(questions: Question[]) {
    return questions.filter(({ done }) => done === true)
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