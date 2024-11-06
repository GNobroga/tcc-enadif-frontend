import { createAction, props } from "@ngrx/store";
import { Question } from "src/app/feature/quiz/components/quiz-question/quiz-question.component";

export interface QuizResultState {
  correctQuestionsId: string[];
  questions?: Question[];
  timer: number[];
  showDialog?: boolean;
  review?: boolean;
}

export const setQuizResultData = createAction('[Quiz Result] Set Quiz Data',
  props<{ correctQuestionsId: string[]; questions?: Question[]; timer: number[]; showDialog?: boolean, review?: boolean }>());

export const resetQuizResultData = createAction('[Quiz Result] Reset');
