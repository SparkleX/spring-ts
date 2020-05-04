import { Result } from "./Result";

export interface Connection {
	open(config:any) : Promise<void>;
	close():Promise<void>;
	execute(sql:string, params?:any[]):Promise<Result>;
	executeQuery(sql:string, params?:any[]):Promise<any[]>;
	setAutoCommit(autoCommit:boolean):Promise<void>;
	commit():Promise<void>;
	rollback():Promise<void>;
}