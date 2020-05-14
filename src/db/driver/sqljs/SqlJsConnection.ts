import { Connection, Result } from '../..';
// @ts-ignore
import * as sqljs  from 'sql.js';

export class SqlJsConnection implements Connection{
	private db: any;

	public constructor(config:any) {
		this.db = new config.Database();
	}

	public async executeQuery(sql: string, params?: any[]): Promise<any[]> {
		let result: Result = await this.execute(sql, params);
		return result.data;

	}

	public async execute(sql: string, params?: any[]): Promise<Result> {
		console.debug(`SqlJsConnection.execute: ${sql} : [${params}]`);
		let result: Result = {};
		var stmt = this.db.prepare(sql,params);
		result.data = [];
		var isResultSet = stmt.step();
		if(isResultSet) {
			var columns:string[] = stmt.getColumnNames();
			do{
				var data:any = {};
				var row = stmt.get();
				for(var index in columns) {
					var colName = columns[index]
					data[colName] = row[index];
				}	
				result.data.push(data);
			}while(stmt.step());
		}

		result.updateCount = this.db.getRowsModified();
		stmt.free();
		return result;
	}
	public async close():Promise<void> {

	}
	async setAutoCommit(autoCommit:boolean): Promise<void> {
		if(autoCommit) {

		}else{
			await this.execute("begin transaction");
		}
	}
	async commit(): Promise<void> {
		await this.execute("commit");
	}
	async rollback(): Promise<void> {
		await this.execute("rollback");
	}

}