import { Connection } from "../db/Connection";
import { Result } from "../db/Result";
import { ApplicationContext } from "../context";

export abstract class BaseRepository<T, ID>{

	protected async getConnection(): Promise<Connection> {
		const conn = await ApplicationContext.DEFAULT.getConnection();
		return conn;
	}
	protected abstract getTableName(): string;
	protected getQuote(): string {
		return "";
	}

	public async findAll():Promise<T[]> {
		
		var sql = `select * from ${this.getQuote()}${this.getTableName()}${this.getQuote()}`;
		console.debug(sql)
		var result = await this.execute(sql);
		return result.data;
	}

	protected async execute(sql: string, param?: any[]): Promise<Result> {
		var conn: Connection = await this.getConnection();
		return conn.execute(sql, param);
	}

	public async findById(id:ID):Promise<T> {
		var columns:string[] = this.getIdColumns(id);
		var values = this.getValues(id, columns);
		var condition = this.sqlKeys(columns);
		var sql = `select * from ${this.getQuote()}${this.getTableName()}${this.getQuote()} where ${condition}`;
		console.debug(sql);
		var result: Result = await this.execute(sql, values);
		if(result.data.length==0) {
			return null;
		}
		return result.data[0];
	}
	public async delete(id: ID):Promise<void>{
		var columns:string[] = this.getIdColumns(id);
		var values = this.getValues(id, columns);

		var condition = this.sqlKeys(columns);
		var sql = `delete from ${this.getQuote()}${this.getTableName()}${this.getQuote()} where ${condition}`;
		console.debug(sql);
		await this.execute(sql, values);
	}		
	private sqlKeys(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.getQuote()}${col}${this.getQuote()}=? and `;
		}
		var sql = rt.substr(0, rt.length-5);
		return sql;
	}
	public async insert(data:T):Promise<void>{
		var columns:string[] = this.getColumns(data);
		var values = this.getValues(data, columns);
		var sqlInsertColumns = this.sqlInsertColumns(columns);
		var sqlInsert = this.sqlInsert(columns);
		var sql = `insert into ${this.getQuote()}${this.getTableName()}${this.getQuote()}(${sqlInsertColumns}) values(${sqlInsert})`;
		console.debug(sql);
		await this.execute(sql, values);
	}
	private sqlInsertColumns(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.getQuote()}${col}${this.getQuote()},`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}	
	private sqlInsert(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}
	public async update(id:ID, data:T):Promise<void>{
		var columns:string[] = this.getColumns(data);
		var values = this.getValues(data, columns);
		var sqlUpdate = this.sqlUpdate(columns);
		var idColumns:string[] = this.getIdColumns(id);
		var sqlWhere = this.sqlKeys(idColumns);
		var sql = `update ${this.getQuote()}${this.getTableName()}${this.getQuote()} set ${sqlUpdate} where ${sqlWhere}`;
		console.debug(sql);
		var idColumn = this.getIdColumns(id);
		var idValue = this.getValues(id, idColumns);
		var params = values.concat(idValue);
		await this.execute(sql, params);
	}
	private sqlUpdate(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.getQuote()}${col}${this.getQuote()}=?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}
	protected getColumns(data: T): string[] {
		var columns = Object.keys(data);
		return columns;
	}
	protected getIdColumns(id: ID): string[] {
		var keys = Object.keys(id);
		return keys;
	}	
	protected getValues(data:any, columns:string[]): any[]{
		var rt = [];
		for(let col of columns) {
			rt.push((data as any)[col]);
		}
		return rt;
	}
}