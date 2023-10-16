import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL_V1 } from 'src/app/app-const';
import { Question } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class QuestionClientService {
  constructor(private http: HttpClient) {}

  getQuestion(quiz_type: 'silhouette-quiz', question_total_cnt: number): Observable<Question[]> {
    const post_params = {
      question_total_cnt: question_total_cnt,
    };
    return this.http.post<Question[]>(`${API_URL_V1}${quiz_type}/get-question/`, post_params);
  }
}
