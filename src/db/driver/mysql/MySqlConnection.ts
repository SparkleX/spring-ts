import { Connection, Result } from '../..';
import * as mysql from 'mysql';
export class MySqlConnection implements Connection{

	private conn: mysql.Connection;
	private autoCommit: boolean = true;

	public constructor(conn: mysql.Connection) {
		this.conn = conn;
	}
	public static async getConnection(config: string | mysql.ConnectionConfig): Promise<Connection> {
		var conn: mysql.Connection;
		await new Promise(function(resolve, reject) {
				conn = mysql.createConnection(config);
				conn.connect(function(err) {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
		return new MySqlConnection(conn);
	}
	public async execute(sql: string, params?: any[]): Promise<Result> {
		let that = this;
		let rt : Result = await new Promise<Result>(function(resolve, reject) {
			that.conn.query(sql, params, function (err, results, fields) {
				if (err){
					reject(err)
					return;
				}
				if(Array.isArray(results)) {
					resolve({data: results});
					return;
				}
				resolve({updateCount: results.affectedRows});
					
			});
		});
		return rt;
	}
	public async executeQuery(sql: string, params?: any[]): Promise<any[]> {
		let result: Result = await this.execute(sql, params);
		return result.data;
	}
	
	public async close():Promise<void> {
		if((this.conn as any).release) {
			(this.conn as any).release();
			return;
		}
		this.conn.end(function(err) {
			/* istanbul ignore next */
			if (err) {
				throw err;
			}
		});
	}
	async setAutoCommit(autoCommit:boolean): Promise<void> {
		if(this.autoCommit === autoCommit) {
			return;
		}
		if(this.autoCommit) {
			await this.beginTransaction();
		} else {
			await this.rollback();			
		}
		this.autoCommit = autoCommit;
	}
	public async commit(): Promise<void> {
		await this._commit();
		await this.beginTransaction();
	}
	private async beginTransaction():Promise<void> {
		var that = this;
		await new Promise(function(resolve, reject) {
			that.conn.beginTransaction(function(err) {
				/* istanbul ignore next */
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
	private _commit(): Promise<void> {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.conn.commit(function (err: mysql.MysqlError) {
				/* istanbul ignore next */
				if(err) {
					reject(err);
					return;
				}
				resolve();
			});
		});		
	}
	async rollback(): Promise<void> {
		var that = this;
		await new Promise(function(resolve, reject) {
			that.conn.rollback(function (err: mysql.MysqlError){
				/* istanbul ignore next */
				if(err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
		await this.beginTransaction();
	}
}