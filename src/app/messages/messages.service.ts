import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {

  private subject = new BehaviorSubject<string[]>([]);

  // using this we cannot emit new values, only subscribe to the observable
  errors$: Observable<string[]> = this.subject.asObservable()
    .pipe(
      filter(messages => Array.isArray(messages) && messages.length > 0)
    );

  showErrors(...errors: string[]): void {
    this.subject.next(errors);
  }
}
