import { ClsLocalStorage } from './ClsLocalStorage';
import { Connection, ConnectionPool } from '../db';


export class ClsExpress {
    public static Default = new ClsExpress();
    private cls = new ClsLocalStorage();
    private dbPool: ConnectionPool;
    public static middleware(req: any, res: any, next: any) {
        ClsExpress.Default.cls.run(function() {
            next();
        });
        
    }
    public get(key: string) {
        return this.cls.get(key);
    }
    public set(key: string, value: any) {
        this.cls.set(key, value);
    }
 
    public async getConnection(): Promise<Connection> {
        var conn: Connection = this.cls.get("__conn");
        if(!conn) {
            conn = await this.dbPool.getConnection();
            this.cls.set("__conn", conn);
        }
        return conn;
    }
    public setPool(pool: ConnectionPool) {
        this.dbPool = pool;
    }
}
