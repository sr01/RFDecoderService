import * as path from 'path';

export default class Settings {
    private static instance: Settings;

    private _appRoot: string = path.resolve(__dirname);

    get appRoot(): string {
        return this._appRoot;
    }

    private constructor() {

    }

    static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }

        return Settings.instance;
    }
}