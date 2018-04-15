import {IExpectedExpression} from './expected-expressions/expected-expression-reflector';
import {Tracker} from './tracker';
import {Times} from './times';
import {MockBehavior} from './interceptor-callbacks/interceptor-callbacks';

export interface ISetup<T> {
    returns<TValue>(value: TValue): IMock<T>;
    throws<TException>(exception: TException): IMock<T>;
    callback<TValue>(callback: (...args: any[])=> TValue): IMock<T>;

    /**
     * Plays the setup when predicate returns true otherwise the setup will be ignored.
     * As predicate {@link PlayTimes} could be used.
     * @param {() => boolean} predicate
     * @returns {ISetup<T>}
     */
    play(predicate:()=> boolean): ISetup<T>;
}

/**
 * @internal
 */
export interface ISetupInvoke<T> extends ISetup<T> {
    playable(): boolean;
    invoke<TResult>(args?: any[]): TResult;
}

export interface IMock<T> {
    name?:string;
    object(): T;
    setup(expression: IExpectedExpression<T>): ISetup<T>;
    tracker: Tracker;
    verify(expression: IExpectedExpression<T>, times?: Times): IMock<T>;
    prototypeof(prototype?:any): IMock<T>;
    setBehaviorStrategy(behaviorStrategy: MockBehavior): IMock<T>;
    insequence(sequence: ISequenceVerifier, expression: IExpectedExpression<T>): IMock<T>;
}

export interface ISequenceVerifier {
    add<T>(mock: IMock<T>, expression: IExpectedExpression<T>): ISequenceVerifier;
    verify(times?: Times): void;
}
