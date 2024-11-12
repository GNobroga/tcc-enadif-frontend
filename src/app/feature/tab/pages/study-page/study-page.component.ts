import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnimationController, ViewDidEnter } from '@ionic/angular';
import { filter, lastValueFrom, Subject, takeUntil } from 'rxjs';
import QuizService from 'src/app/core/services/quiz.service';
import { Question } from 'src/app/feature/quiz/components/quiz-question/quiz-question.component';

@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.scss'],
})
export class StudyPageComponent implements OnInit, OnDestroy {

  @ViewChildren('studyItem')
  studyItems!: QueryList<ElementRef>;

  listProgressByCategory: { category: string; totalQuizzes: number; completedQuizzes: number; }[] = [];

  killAllObservers = new Subject();

  isLoading = false;

  constructor(
    readonly animationController: AnimationController,
    readonly quizService: QuizService,
    readonly router: Router,
  ) {

  }

  async ngOnInit() {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.killAllObservers))
        .subscribe(async () => {
            this.isLoading = true;
            const categories = ['logic', 'computing', 'software', 'infrastructure', 'security'];
            const categoryPromises = categories.map(category => lastValueFrom(this.quizService.getCategoryQuizProgress(category)));
            const result = await Promise.all(categoryPromises);
            this.listProgressByCategory = [];
            result.forEach(({ totalQuizzes, completedQuizzes }, index) => {
              this.listProgressByCategory.push({ category: categories[index], totalQuizzes, completedQuizzes });
            });
            this.isLoading = false;
            setTimeout(() => {
              this.studyItems.map(item => item.nativeElement)
              .forEach((element, position) => {
                  this.createAnimation(element, (1 + position) * 150).play();
              });
            }, 100);
        });
  }

  getProgressByCategory(category: Question['category']) {
    return this.listProgressByCategory.find(categoryProgress => categoryProgress.category === category);
  }

  getProgressPercent(totalCompleted: number, totalQuizzes: number): number {
    if (totalQuizzes === 0) return 0; 
    return (totalCompleted / totalQuizzes); 
  }
  

  public createAnimation(element: HTMLElement, delay: number) {
    return this.animationController.create()
    .addElement(element)
    .fromTo('opacity', '0', '1')
    .easing('ease')
    .duration(1000)
    .delay(delay)
    .fill('forwards');
  }

  ngOnDestroy(): void {
      this.killAllObservers.next(true);
  }

}
