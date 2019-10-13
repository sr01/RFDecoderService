import { Code } from "./Code";
import Datastore from 'nedb';
import * as path from 'path';
import Settings from '../../Settings'

export class CodeRepository {

    private dbPath = path.join(Settings.getInstance().appRoot, 'db/codes_db');
    private db = new Datastore({ filename: this.dbPath, autoload: true });

    constructor() {
        console.log(`dbPath: ${this.dbPath}`);
    }

    put(code: Code) {
        this.db.insert(code)
    }

    get(name: String, callback : (err: Error, codes : Array<Code>) => void) {
        this.db.find({name : name}, function(err : Error, codes : Array<Code>){
            callback(err, codes)
        });
    }
}