import { Component, effect, OnDestroy, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController, ViewDidEnter } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { interval, lastValueFrom, scan, Subscription, tap } from 'rxjs';
import { AppState, selectQuizResultData } from 'src/app/store';
import { setQuizResultData } from 'src/app/store/actions/quiz-result.actions';
import { Question, QuizQuestionComponent } from '../../components/quiz-question/quiz-question.component';
import { QuizResultState } from '../quiz-result/quiz-result.component';
import QuizService from 'src/app/core/services/quiz.service';

export type ReviewState = {
  review: boolean;
  timer: [number, number, number];
  correctQuestionsId: number[];
}

export const QUIZ_STARTED_REVIEW_STATE_KEY = 'quiz_started_review_state';

@Component({
  selector: 'app-quiz-started',
  templateUrl: './quiz-started.component.html',
  styleUrls: ['./quiz-started.component.scss'],
})
export class QuizStartedComponent implements OnDestroy, ViewDidEnter {

    timer = signal([0, 0, 0]); // hours, minutes and seconds

    questions = signal([] as Question[]);

    static readonly HOUR_LIMIT = 2; // 2 horas

    @ViewChild(QuizQuestionComponent)
    quizQuestionComponent!: QuizQuestionComponent;

    @ViewChild(IonContent)
    ionContent!: IonContent;

    currentQuestion = signal<Question | null>(null);

    currentQuestionIndex = signal<number | null>(null);

    listCorrectQuestionsId = signal<string[]>([]);

    currentPercentage = signal(0);

    disableButton = signal(false);

    isReview = signal(false);

    isBellSwinging = signal(false);

    remainingChances = signal(3);

    subscription = new Subscription();

    timerSubscription = new Subscription();

    quizId = signal<string | null>(null);

    category = signal<string | null>(null);

    isCustomized = signal(false);

    excludeCategories = signal(false);

    isLoading = signal(false);

    constructor(
      readonly router: Router,
      readonly route: ActivatedRoute,
      readonly store: Store<AppState>,
      readonly quizService: QuizService,
      readonly navController: NavController,
    ) {
    }

    async ionViewDidEnter() {
      this.timerSubscription.unsubscribe();
      const quizId = this.route.snapshot.params['id'];
      if (!quizId) {
        this.router.navigate(['/quiz']);
        return;
      }

      this.isLoading.set(true);
      this.quizId.set(quizId);

      const category = this.route.snapshot.queryParams['category'];
      const isCustomized = this.route.snapshot.queryParams['customized'] as boolean;
      const excludeCategories = this.route.snapshot.queryParams['excludeCategories'] ?? [];

      this.isCustomized.set(isCustomized);
      this.excludeCategories.set(excludeCategories);
 
      let fetchQuestions = isCustomized  ? 
        lastValueFrom(this.quizService.findById(quizId, excludeCategories)) :
        lastValueFrom(this.quizService.getByQuizIdAndCategory(quizId, category));
      
      if (category) {
        this.category.set(category);
      }
  
      const { questions } = await fetchQuestions;

      if (!questions.length && this.isCustomized()) {
       this.navController.navigateBack(['/quiz/customized'], {
          queryParams: {
            excludeCategories: this.excludeCategories(),
            quizId: this.quizId(),
            no_questions: true,
          }
       });
        return;
      }

      this.questions.set(questions);

      const data = this.store.selectSignal(selectQuizResultData)();

      if (data.review) {
        this.timer.set(data.timer);
        this.listCorrectQuestionsId.set(data.correctQuestionsId);
        this.currentPercentage.set(1);
        this.isReview.set(true);
        this.isBellSwinging.set(false);
      } else {
        this.timer.set([0, 0, 0]);
        this.listCorrectQuestionsId.set([]);
        this.currentPercentage.set(0);
        this.disableButton.set(true);
        this.timerSubscription = new Subscription();
        this.isReview.set(false);
        this.startTimer();
        this.showBellSwinging();
      }

      if (this.questions().length > 0) {
        this.currentQuestion.set(this.questions()[0]);
        this.currentQuestionIndex.set(0);
      }

      this.isLoading.set(false);
    }


    startTimer() {
      const subscription = interval(1000)
      .pipe(
        scan(seconds => seconds + 1, 0),
        tap(totalSeconds => {
          this.timer.update(oldTimer => {
            let [hours, minutes, seconds] = oldTimer;

            // Calcular os segundos, minutos e horas
            seconds = totalSeconds % 60;
            minutes = Math.floor(totalSeconds / 60) % 60;
            hours = Math.floor(totalSeconds / 3600);

            return [hours, minutes, seconds];
          });
        })
      )
      .subscribe();

      this.timerSubscription.add(subscription);

      subscription.add(subscription);
    }

   get timerFormatted() {
        const [hours, minutes, seconds] = this.timer();
        const hoursString = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
        return `${hoursString}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
   }

   get timeHasPassed() {
    return this.timer()[0] > QuizStartedComponent.HOUR_LIMIT;
   }

   onClickBell() {
      // Pego a alternativa correta
      const correctId = this.currentQuestion()?.correctId!;
      // Atualizo a quantidade de corações disponíveis.
      this.remainingChances.update(oldRemainingChances => oldRemainingChances - 1);
      this.quizQuestionComponent.markAnswer(correctId);
   }

   goToNext() {
        if (this.currentQuestionIndex() === null) return;

        const currentQuestionIndex = this.currentQuestionIndex()! + 1;
        this.currentPercentage.set(currentQuestionIndex / this.questions().length);


        if (this.quizQuestionComponent.isCorrect()) {
          this.listCorrectQuestionsId.set(this.listCorrectQuestionsId().concat(this.currentQuestion()!._id));
        }

        this.quizQuestionComponent.selectedAlternativeId.set(null);

        if (currentQuestionIndex < this.questions().length) {
            this.currentQuestion.set(this.questions()[currentQuestionIndex]);
            this.currentQuestionIndex.set(currentQuestionIndex);
            this.disableButton.set(true);
            this.quizQuestionComponent.scrollEnd.set(false);
            this.quizQuestionComponent.scrollEndSize.set(-1);
            this.showBellSwinging();
            this.ionContent.scrollToTop(200);
        } else {
          this.store.dispatch(setQuizResultData({
            correctQuestionsId: this.listCorrectQuestionsId(),
            questions: this.questions(),
            timer: this.timer(),
            showDialog: true
          }));
          this.router.navigate(['/quiz/result'], {
            queryParams: {
              quizId: this.quizId(),
              category: this.category(),
              customized: this.isCustomized(),
              excludeCategories: this.excludeCategories(),
            },
          });
        }
   }

  showBellSwinging() {
    if (this.remainingChances() <= 0) return;
    this.isBellSwinging.set(false);
    setTimeout(() => {
      this.isBellSwinging.set(true);
    }, 30000);
  }

   seeNextQuestion() {
      const currentQuestionIndex = this.currentQuestionIndex()! + 1;
      if (currentQuestionIndex < this.questions().length) {
        this.currentQuestion.set(this.questions()[currentQuestionIndex]);
        this.currentQuestionIndex.set(currentQuestionIndex);
      } else {
        this.store.dispatch(setQuizResultData({
          showDialog: false
        } as QuizResultState));
        this.router.navigate(['/quiz/result'], {
          queryParams: {
            quizId: this.quizId(),
            category: this.category(),
            customized: this.isCustomized(),
            excludeCategories: this.excludeCategories(),
          },
        });
      }
   }

   seePreviousQuestion() {
      if (this.currentQuestionIndex() === null) return;
      const currentQuestionIndex = this.currentQuestionIndex()! - 1;
      if (currentQuestionIndex >= 0) {
        this.currentQuestion.set(this.questions()[currentQuestionIndex]);
        this.currentQuestionIndex.set(currentQuestionIndex);
      }
   }

   ngOnDestroy(): void {
       this.subscription.unsubscribe();
   }
}
