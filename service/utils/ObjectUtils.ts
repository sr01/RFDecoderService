
export function copy(obj : any) : any {
    return JSON.parse(JSON.stringify(obj));
}