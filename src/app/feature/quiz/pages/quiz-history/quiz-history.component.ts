import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonSegment, ViewDidEnter } from '@ionic/angular';
import QuizService, { QuizHistory } from 'src/app/core/services/quiz.service';

@Component({
  selector: 'app-quiz-history',
  templateUrl: './quiz-history.component.html',
  styleUrls: ['./quiz-history.component.scss'],
})
export class QuizHistoryComponent implements ViewDidEnter, OnInit {

  constructor(
    readonly quizService: QuizService,
    readonly cdr: ChangeDetectorRef,
  ) { }

  @ViewChild(IonSegment)
  ionSegment!: IonSegment;

  quizzes: QuizHistory[] = [];
  cacheQuizzes: QuizHistory[] = [];
  isLoading = false;

  optionsYears: { label: string, value: any }[] = [];

  selectedYear = new FormControl({ label: 'all', value: 'Todos' });

  ngOnInit() {
      this.selectedYear.valueChanges.subscribe(data => {
        const { label, value } = data as { label: string; value: any; };
        if (label === 'all') {
          this.cacheQuizzes = this.quizzes;
          return;
        }
        this.cacheQuizzes = this.quizzes.filter(({ year }) => year === value);
        this.ionSegment.value = 'default';
      });
  }

  ionViewDidEnter() {
      this.isLoading = true;
      this.quizService.listHistory().subscribe(result => {
        this.quizzes = result;
        this.cacheQuizzes = result;
        this.isLoading = false;
      });

      this.quizService.listYears().subscribe(result => {
        this.optionsYears = result.data.map(({ year }) => ({ label: year.toString(), value: year, }));
        this.optionsYears = [{ label: 'all', value: 'Todos', }, ...this.optionsYears];
      });
  }

  orderBy(event: any) {
    const { detail: { value } } = event; 
    let quizzes = [...this.quizzes];
    if (value === 'smaller') {
      quizzes = quizzes.sort((a, b) => b.score - a.score);
    } else if (value === 'greater') {
      quizzes = quizzes.sort((a, b) => a.score - b.score);
    }
    this.cacheQuizzes = quizzes;
    this.cdr.detectChanges();
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
