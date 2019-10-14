import { Code } from "./Code";
import Datastore from 'nedb';
import * as path from 'path';
import appRoot from '../../approot'

export class CodeRepository {

    private dbPath = path.join(appRoot, 'db/codes_db');
    private db = new Datastore({ filename: this.dbPath, autoload: true });

    put(code: Code, callback : (err: Error, codes : Code) => void) {
        this.db.insert(code, function(err : Error, code : Code){
            callback(err, code);
        })
    }

    get(name: String, callback : (err: Error, codes : Array<Code>) => void) {
        this.db.find({name : name}, function(err : Error, codes : Array<Code>){
            callback(err, codes);
        });
    }
}