import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log('Loading service has been created!');
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null) // the initial value that is emitted by the Observable
      .pipe(
        tap(() => this.loadingOn()), // use the initial value to set the loading state on
        concatMap(() => obs$), // emit all the values comming from the input Observable
        finalize(() => this.loadingOff()) // at the end (or on error), just stop the loading
      );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}