import { Table } from "../generated/ddl/Table";

export interface DdlBuilder {
	createTable(mdTable: Table):string[];
	insertSql(mdTable: Table):string;
	insertData(mdTable: Table, data:object[]):any[][];
}