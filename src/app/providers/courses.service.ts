import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import Course from '../models/Course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  coursesApiUrl = `${environment.apiUrl}/${environment.coursesPath}`;

  constructor(private httpClient: HttpClient) {}

  getAll(): Promise<Course[]> {
    return this.httpClient.get<Course[]>(this.coursesApiUrl).toPromise();
  }

  getById(id: string): Promise<Course> {
    return this.httpClient
      .get<Course>(`${this.coursesApiUrl}/${id}`)
      .toPromise();
  }
  add(body: {}) {
    return this.httpClient
      .post<Course>(`${this.coursesApiUrl}`, body)
      .toPromise();
  }
}
