export interface Callback<T> {
    ( error?: Error, result?: T ) : void;
}