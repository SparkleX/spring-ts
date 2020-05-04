import {DdlBuilder, Table, Column} from "../ddl";

export class SqlJsDdlBuilder implements DdlBuilder {
	private q = '';
	public createTable(mdTable: Table): string[] {
		var columns = "";
		for(let colName in mdTable.columns ) {
			columns = columns + `${colName},`;
		}
		columns = columns.substr(0, columns.length-1);
		var sql = `create table ${mdTable.name} (${columns})`
		return [sql];
	}	
	public insertSql(mdTable: Table): string {
		var columns = this.sqlInsertColumns(mdTable.columns);
		var values = this.sqlInsertParams(mdTable.columns);
		return `insert into ${mdTable.name} (${columns}) values (${values})`;
	}
	public insertData(mdTable: Table, data: object[]): any[][] {
		var rt:any[][] = [];
		for(let row of data) {
			var rowArray:any[] = [];
			for(let name in mdTable.columns ) {
				rowArray.push((row as any)[name]);
			}
			rt.push(rowArray);
		}
		return rt;
	}
	private sqlInsertColumns(columns: {[name:string]:Column}) {
		var rt = "";
		for(let name in columns) {
			rt = rt  + `${this.q}${name}${this.q},`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}	
	private sqlInsertParams(columns: {[name:string]:Column}) {
		var rt = "";
		for(let name in  columns) {
			rt = rt  + `?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}
}