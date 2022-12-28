import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: 'root',
})
export class CoursesStore {
  
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
    ) {
      this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(error => {
          const message = 'Could not load courses';
          this.messagesService.showErrors(message);
          console.log(message, error);
          return throwError(error);
        }),
        tap((courses) => this.subject.next(courses)),
      );
      this.loadingService.showLoaderUntilCompleted(loadCourses$)
        .subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {

    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.subject.next(newCourses); // emit the new update courses

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError((error) => {
          const message = 'Could not save course';
          this.messagesService.showErrors(message);
          console.log(message, error);
          return throwError(error);
        }),
        shareReplay()
      )
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses.filter(course => course.category === category))
      );
  }
}