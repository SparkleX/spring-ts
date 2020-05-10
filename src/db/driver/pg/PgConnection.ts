import { Connection, Result } from '../..';
import { Client } from 'pg';
/* istanbul ignore file */
export class PgConnection implements Connection{

	private client: any;

	public constructor(conn?:any) {
		this.client = conn;
	}
	public async open(config:any) : Promise<void> {
		this.client = new Client(config);
        await this.client.connect();
	}
	public async execute(sql: string, params?: any[]): Promise<Result> {
		console.log(`PgConnection.execute: ${sql}`);
		var result = await this.client.query(sql, params);
		//console.dir(result);
		var rt : Result = {};
		rt.data = result.rows;	
		rt.updateCount = result.rowCount;
		return rt;//(result.command =="SELECT");
	}
	public async executeQuery(sql: string, params?: any[]): Promise<any[]> {
		let result: Result = await this.execute(sql, params);
		return result.data;
	}
	
	public async close():Promise<void> {
		if(this.client.release) {
			await this.client.release();
		}
		else {
			await this.client.end();	
		}
	}
	async setAutoCommit(autoCommit:boolean): Promise<void> {
		if(autoCommit==false) {
			await this.client.query('BEGIN');
		}
	}
	async commit(): Promise<void> {
		await this.client.query('COMMIT');
	}
	async rollback(): Promise<void> {
		await this.client.query('ROLLBACK')
	}

}