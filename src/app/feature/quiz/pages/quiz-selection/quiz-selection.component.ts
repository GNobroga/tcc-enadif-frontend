import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import QuizService, { Quiz } from 'src/app/core/services/quiz.service';
import { Question } from '../../components/quiz-question/quiz-question.component';
import { ActivatedRoute } from '@angular/router';
import { Tag } from 'primeng/tag';
import { FormControl } from '@angular/forms';

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

  cacheQuizzes = signal([] as Quiz[]);

  isLoading = signal(false);

  stateOptions = signal([] as any[]);

  selectedYear = new FormControl('all');

  constructor(
    readonly quizService: QuizService,
    readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.selectedYear.valueChanges.subscribe(value => {
      if (value === 'all') {
        this.cacheQuizzes.set(this.quizzes());
        return;
      }
      this.cacheQuizzes.set(this.quizzes().filter(({ year }) => year.toString() === value?.toString()));
    });

    this.route.url.subscribe(() => {
      this.loadQuizzes();
    });
  }

  ngOnChanges() {
    this.loadQuizzes();
  }

  getRandomColor() {
    const colors: Array<'primary' | 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast'> = ['primary', 'success', 'secondary', 'info', 'warning', 'danger', 'contrast'];
    return colors[Math.floor(Math.random() * colors.length)] as Tag['severity'];
  }

  
  private loadQuizzes() {
    if (!this.category) return;
    this.isLoading.set(true);
    this.quizService.listByCategoryName(this.category)
      .subscribe(quizzes => {
        this.quizzes.set(quizzes);
        this.cacheQuizzes.set(quizzes);
        this.isLoading.set(false);
      });

    this.quizService.listYears().subscribe(result => {
      this.stateOptions.set(result.data.map(({ year }) => ({ label: year.toString(), value: year })));
      this.stateOptions.update(oldValues => [{ label: 'Todos', value: 'all' }, ...oldValues]);
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