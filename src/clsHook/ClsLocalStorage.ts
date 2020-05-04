import { createNamespace } from 'cls-hooked';

export class ClsLocalStorage {
    private session : any;
    constructor() {
        this.session = createNamespace('my session');
    }
    public run(fn: any) {
        this.session.run(fn);
    }
    public set(key: string, value: any): void {
        this.session.set(key, value);
    }
    public get(key: string): any {
        return this.session.get(key);
    }
}