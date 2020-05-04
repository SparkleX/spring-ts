import { Table } from "../generated/ddl/Table";
import * as fs from "fs";
import * as jsonfile from "jsonfile";
export class Metadata {
	public constructor() {
	}
	public tables:{ [key:string]:Table; } = {}
	public static async load(filename:string):Promise<Table> {
		var table: Table = jsonfile.readFileSync(filename);
		return table;

	}
	public static async loadAll(foldername:string):Promise<Metadata> {
		var rt:Metadata = new Metadata();
		var files:string[] = fs.readdirSync(foldername);
		for (let file of files) {
			var mdTable = await Metadata.load(foldername + file);
			rt.tables[mdTable.name] = mdTable;
		}
		return rt;
	}	
}