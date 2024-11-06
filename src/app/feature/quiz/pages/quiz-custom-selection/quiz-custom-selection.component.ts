import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InputCustomEvent, RangeCustomEvent, SelectChangeEventDetail, ViewDidEnter } from '@ionic/angular';
import QuizService, { Quiz } from 'src/app/core/services/quiz.service';

@Component({
  selector: 'app-quiz-custom-selection',
  templateUrl: './quiz-custom-selection.component.html',
  styleUrls: ['./quiz-custom-selection.component.scss'],
})
export class QuizCustomSelectionComponent implements ViewDidEnter {

  
  readonly data = signal([] as { year: number; id: string; }[]);
  
  readonly quiz = signal<Quiz | null>(null);
  
  readonly count = signal(0);

  readonly excludeCategories = signal([] as string[]);

  constructor(
    readonly quizService: QuizService,
    readonly router: Router,
    readonly alertController: AlertController,
    readonly route: ActivatedRoute,
  ) { }

  async ionViewDidEnter() {
    const quizId = this.route.snapshot.queryParams['quizId'];
    const excludeCategories: string[] = this.route.snapshot.queryParams['excludeCategories'] ?? [];

    if (this.route.snapshot.queryParams['no_questions']) {
      const alert = await this.alertController.create({
        animated: true,
        backdropDismiss: true,
        header: 'Atenção',
        subHeader: 'Nenhuma questão disponível',
        message: 'Por favor, selecione outra e tente novamente.',
        buttons: [
            {
                text: 'OK',
                role: 'cancel',
                cssClass: 'alert-button-confirm',
            }
        ]
    });
    await alert.present();
    }

    if (quizId) {
      this.quizService.findById(quizId)
      .subscribe(data =>  {
        this.quiz.set(data);
        this.count.set(data.questions.length);
      });
    }

    this.excludeCategories.set(excludeCategories);

    this.quizService.listYears()
      .subscribe(result => {
        this.data.set(result.data);
      });
  }

  async onStart() {
    const quizId = this.quiz()?._id;
    if (!quizId) return;
    if (this.excludeCategories().length >= 5) {
      const alert = await this.alertController.create({
          animated: true,
          backdropDismiss: true,
          header: 'Atenção',
          subHeader: 'Nenhuma disciplina selecionada',
          message: 'Por favor, selecione pelo menos uma disciplina para continuar.',
          buttons: [
              {
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'alert-button-confirm',
              }
          ]
      });
      await alert.present();
    
      return;
    }
    this.router.navigate(['/quiz/started', quizId], {
      queryParams: {
        customized: true,
        excludeCategories: this.excludeCategories().length ? this.excludeCategories() : undefined,
      },
    })
  }
  
  get totalQuestions() {
    return this.quiz()?.questions.length ?? 0;
  }

  toggleExcludeCategories(category: string) {
    if (this.excludeCategories().includes(category)) {
      this.excludeCategories.set(this.excludeCategories().filter(target => target !== category));
    } else {
      this.excludeCategories().push(category);
    }
  }

  containsCategoryInExcludeCategories(category: string) {
    return this.excludeCategories().includes(category);
  }

  get minQuestions() {
    return Math.floor(this.totalQuestions / 2);
  }

  onChange(event: CustomEvent<SelectChangeEventDetail>) {
    this.quizService.findById(event.detail.value)
      .subscribe(data =>  {
        this.quiz.set(data);
        this.count.set(data.questions.length);
      });
  }

  public onRangeChange(event: RangeCustomEvent) {
    this.count.set(event.detail.value as number);
  }


}
