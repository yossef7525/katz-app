import { BehaviorSubject, Observable } from 'rxjs';

export interface BaseStateOptions {
  logStateChanges?: boolean;
}

export class BaseStateService<T> {
  private state$: BehaviorSubject<T | undefined>;

  protected get state(): T {
    return this.state$.value as T;
  }

  protected set state(state: T) {
    this.setState(state);
  }

  protected get stateChanged(): Observable<T> {
    return this.state$.asObservable() as Observable<T>;
  }

  constructor(private options?: BaseStateOptions, initializeState?: T) {
    this.state$ = new BehaviorSubject(initializeState);
  }

  protected initializeState(state: T): void {
    this.setState(state, 'Initialize State');
  }

  protected setState(state: Partial<T>, action?: string): void {
    const oldValue = this.state$.value;
    const newState: T = oldValue ? { ...oldValue, ...state } : (state as T);
    this.state$.next(newState);
    this.logStateChange(newState, action);
  }

  protected clearState(): void {
    this.state$.next(undefined);
  }

  private logStateChange(state: Partial<T>, action?: string) {
    if (!this.options?.logStateChanges) return;

    const caller = this.constructor ? this.constructor.name : '';
    const message = `${action ? `\r\nAction: ${action}` : ''}\r\nCaller: ${caller}\r\nState:`;
    // eslint-disable-next-line no-console
    console.log('%cSTATE CHANGED%s%o', 'font-weight: bold; color: #1565c0', message, state);
  }
}
