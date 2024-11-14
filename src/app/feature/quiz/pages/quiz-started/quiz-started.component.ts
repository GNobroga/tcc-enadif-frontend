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
import UserService, { UserStats } from 'src/app/core/services/user.service';
import GeminiAPIService from 'src/app/core/services/gemeniAPI.service';
import { IonModal } from '@ionic/angular/common';

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

    questionExplanation = signal<string | null>(null);

    disableAlternatives = signal(false);

    disableClickBell = signal(false);

    isCompletedReview = signal(false);

    isRandomize = signal(false);

    constructor(
      readonly router: Router,
      readonly route: ActivatedRoute,
      readonly store: Store<AppState>,
      readonly quizService: QuizService,
      readonly navController: NavController,
      readonly userService: UserService,
      readonly geminiAPIService: GeminiAPIService,
    ) {
    }

    async ionViewDidEnter() {
      this.timerSubscription.unsubscribe();
      this.userService.getStats().subscribe(stats => {
        this.remainingChances.set(stats.dailyHintCount);
      });
      const quizId = this.route.snapshot.params['id'];
      if (!quizId) {
        this.router.navigate(['/quiz']);
        return;
      }

      this.isLoading.set(true);
      this.quizId.set(quizId);

      const isCompletedReview = this.route.snapshot.queryParams['completedReview'];
      const category = this.route.snapshot.queryParams['category'];
      const isCustomized = this.route.snapshot.queryParams['customized'];
      const excludeCategories = this.route.snapshot.queryParams['excludeCategories'] ?? [];
      const randomize = this.route.snapshot.queryParams['randomize'] === 'true';
      const limit = this.route.snapshot.queryParams['limit'];

      this.isCustomized.set(isCustomized);
      this.excludeCategories.set(excludeCategories);
      this.isCompletedReview.set(isCompletedReview);
      this.isRandomize.set(randomize);
 
      let fetchQuestions = isCustomized  ? 
        lastValueFrom(this.quizService.findById(quizId, excludeCategories, limit)) :
        lastValueFrom(this.quizService.getByQuizIdAndCategory(quizId, category, randomize ? 1 : null));
      
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
      if (data.review || isCompletedReview) {
        if (data.review) {
          this.timer.set(data.timer);
          this.listCorrectQuestionsId.set(data.correctQuestionsId);
        }
        this.currentPercentage.set(1);
        this.isReview.set(true);
        this.isBellSwinging.set(false);
        this.disableAlternatives.set(true);
        this.disableClickBell.set(true);
        this.questionExplanation.set(null);
      } else {
        this.timer.set([0, 0, 0]);
        this.listCorrectQuestionsId.set([]);
        this.currentPercentage.set(0);
        this.disableButton.set(true);
        this.disableAlternatives.set(false);
        this.disableClickBell.set(false);
        this.timerSubscription = new Subscription();
        this.questionExplanation.set(null);
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


  async showAnswer(modal: IonModal) {
    const question = this.currentQuestion()!;
    if (!question) return;
    const message = `
        Pergunta: ${question?.title || 'Desconhecida'}
        Detalhes da Pergunta: ${JSON.stringify(question, null, 2)}  
        Me explique do porque a 'correctId' é a correta? Resuma.
    `;
    this.questionExplanation.set(await this.geminiAPIService.sendMessage(message));
    modal.present();
  }

  get timerFormatted() {
        const [hours, minutes, seconds] = this.timer();
        const hoursString = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
        return `${hoursString}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
   }

   get timeHasPassed() {
    return this.timer()[0] > QuizStartedComponent.HOUR_LIMIT;
   }

   async onClickBell() {
      if (this.remainingChances() <= 0 || this.disableClickBell()) return;
      const correctId = this.currentQuestion()?.correctId!;
      this.remainingChances.update(oldRemainingChances => oldRemainingChances - 1);
      this.quizQuestionComponent.markAnswer(correctId);
      const question = this.currentQuestion()!;
      const message = `
          Pergunta: ${question?.title || 'Desconhecida'}
          Detalhes da Pergunta: ${JSON.stringify(question, null, 2)}  
          Me explique do porque a 'correctId' é a correta? Resuma.
      `;
      this.questionExplanation.set(await this.geminiAPIService.sendMessage(message));
      this.userService.decreaseDailyHint().subscribe();
      this.disableAlternatives.set(true);
      this.disableClickBell.set(true);
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
            this.disableAlternatives.set(false);
            this.questionExplanation.set(null);
            this.disableClickBell.set(false);
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
              randomize: this.isRandomize(),
            },
          });
        }
   }

  get difficulty() {
    const currentQuestion = this.currentQuestion();
    if (!currentQuestion) return '';
    const { difficulty } = currentQuestion;
    if (difficulty === 'easy') return 'Fácil';
    if (difficulty === 'medium') return 'Médio';
    return 'Difícil';
  }

  showBellSwinging() {
    if (this.remainingChances() <= 0) return;
    this.isBellSwinging.set(false);
    setTimeout(() => {
      this.isBellSwinging.set(true);
    }, 10000);
  }

  // Obtém a rota pra voltar para a rota de origem quando for opção revisar.
  determineRedirectRouteByCategory() { 
    const category = this.category()!;
    if (!category) return '/taba/study';
    if (category === 'logic') return '/quiz/programming-logic';
    if (category === 'security') return '/quiz/information-security';
    if (category === 'software') return '/quiz/software-development';
    if (category === 'infrastructure') return '/quiz/infrastructure';
    return '/quiz/fundamentals-of-computing';
  }

  seeNextQuestion() {
      const currentQuestionIndex = this.currentQuestionIndex()! + 1;
      if (currentQuestionIndex < this.questions().length) {
        this.currentQuestion.set(this.questions()[currentQuestionIndex]);
        this.currentQuestionIndex.set(currentQuestionIndex);
        this.questionExplanation.set(null);
      } else {
        if (this.isCompletedReview()) {
          this.router.navigate([this.determineRedirectRouteByCategory()]);
          return;
        }
        this.store.dispatch(setQuizResultData({
          showDialog: false
        } as QuizResultState));
        this.router.navigate(['/quiz/result'], {
          queryParams: {
            quizId: this.quizId(),
            category: this.category(),
            customized: this.isCustomized(),
            excludeCategories: this.excludeCategories(),
            randomize: this.isRandomize(),
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
        this.questionExplanation.set(null);
      }
   }

   ngOnDestroy(): void {
       this.subscription.unsubscribe();
   }
}
