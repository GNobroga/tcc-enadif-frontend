import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, signal, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController, ViewDidEnter } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { first, interval, lastValueFrom, Subscription } from 'rxjs';
import { AppState, selectQuizResultData } from 'src/app/store';
import { resetQuizResultData, setQuizResultData } from 'src/app/store/actions/quiz-result.actions';
import { Question } from '../../components/quiz-question/quiz-question.component';
import { QuizResultDialogComponent } from '../../components/quiz-result-dialog/quiz-result-dialog.component';
import QuizService from 'src/app/core/services/quiz.service';

export const QUIZ_RESULT_STATE_KEY = 'quiz_result_state';

export interface QuizResultState {
  questions?: Question[];
  timer: number[];
  correctQuestionsId: string[];
  showDialog?: boolean;
  review?: boolean;
}

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss'],
})
export class QuizResultComponent implements ViewDidEnter, AfterViewInit, OnDestroy {

  @ViewChildren('img', { read: ElementRef })
  starsIcons!: QueryList<ElementRef>;

  subscription = new Subscription();

  questions = signal<Question[]>([]);
  timer = signal<number[]>([0, 0, 0]);
  correctQuestionsId = signal<string[]>([]);

  quizId = signal<string | null>(null);

  category = signal<string | null>(null);

  excludeCategories = signal<string[]>([]);

  isCustomized = signal(false);

  isRandomize = signal(false);

  showButtons = signal(true);

  limit = signal<number | undefined>(undefined);

  constructor(
    readonly animationController: AnimationController,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly dialog: MatDialog,
    readonly store: Store<AppState>,
    readonly quizService: QuizService,
  ) { }

  async ionViewDidEnter() {
    this.quizId.set(this.route.snapshot.queryParams['quizId'] as string);
    this.category.set(this.route.snapshot.queryParams['category'] as string);
    this.isCustomized.set(this.route.snapshot.queryParams['customized'] as boolean);
    this.excludeCategories.set(this.route.snapshot.queryParams['excludeCategories'] as string[]);
    const randomize = this.route.snapshot.queryParams['randomize'] === 'true';
    this.isRandomize.set(randomize);
    this.limit.set(this.route.snapshot.queryParams['limit']);

    const data = this.store.selectSignal(selectQuizResultData)();
    if (!data) {
      return;
    }
    const { questions = [], timer, correctQuestionsId, showDialog = true } = data;
    this.questions.set(questions);
    this.timer.set(timer);
    this.correctQuestionsId.set(correctQuestionsId);

    if (!showDialog) {
      return;
    }

    this.showButtons.set(false);

    const { score } = await lastValueFrom(this.quizService.finishQuiz({
      quizId: this.quizId()!,
      correctQuestionIds: this.correctQuestionsId(),
      timeSpent: this.timer(),
      category: this.category()!,
      excludeCategories: this.excludeCategories(),
      randomize,
    }));

    let ref: MatDialogRef<QuizResultDialogComponent, any> | null = null;

    if (correctQuestionsId.length === questions.length) {
      ref = this.dialog.open(QuizResultDialogComponent, {
        data: {
          type: 'good-job',
          score,
        }
      });
    } else if (correctQuestionsId.length >= questions.length / 2) {
      ref = this.dialog.open(QuizResultDialogComponent, {
        data: {
          type: 'good-effort',
          score,
        }
      });
    } else {
      ref = this.dialog.open(QuizResultDialogComponent, {
        data: {
          type: 'failure',
          score
        }
      });
    }

    ref?.afterClosed().pipe(first()).subscribe(() => {
      this.showButtons.set(true);
    });
    
  }

  ngAfterViewInit() {
    interval(3000)
      .subscribe(() => {
        this.starsIcons.forEach((star, index) => {
          this.animationController.create()
            .addElement(star.nativeElement)
            .duration(1000)
            .iterations(1)
            .fromTo('transform', 'scale(0)', 'scale(1)')
            .delay(index * 500)
            .play();
        });
      });
  }

  get timerFormatted() {
    const [hours, minutes, seconds] = this.timer() ?? [0, 0, 0];
    const hoursString = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    return `${hoursString}${minutes?.toString().padStart(2, '0')}:${seconds?.toString().padStart(2, '0')}`;
  }

  get percentageHits() {
    return (this.correctQuestionsId().length / this.questions().length);
  }

  reviewQuestions() {
    this.store.dispatch(setQuizResultData({
      review: true,
      timer: this.timer(),
      correctQuestionsId: this.correctQuestionsId(),
    } as QuizResultState));

    if (!this.isCustomized()) {
      this.router.navigate(['/quiz/started', this.quizId()], {
        queryParams: { category: this.category(),  randomize: this.isRandomize(), },
      });
      return;
    }

    this.router.navigate(['/quiz/started', this.quizId()], {
      queryParams: { 
        customized: this.isCustomized(), 
        excludeCategories: this.excludeCategories(),
        limit: this.limit(),
      },
    });
  }

  isCorrectQuestion(id: string) {
    return this.correctQuestionsId().includes(id);
  }

  async restart() {
    this.store.dispatch(resetQuizResultData());
    if (this.isCustomized()) {
      this.router.navigate(['/quiz/customized'], {
        queryParams: {
          excludeCategories: this.excludeCategories(),
          quizId: this.quizId(),
        },
      });
      return;
    }
    this.router.navigate(['/quiz/started', this.quizId()], {
      queryParams: {
        category: this.category(),
      },
    });
  }

  async goToStudyPage() {
    this.store.dispatch(resetQuizResultData());
    if (this.isRandomize()) {
      this.router.navigate(['/tabs']);
      return;
    }
    this.router.navigate(['/tabs/study']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
