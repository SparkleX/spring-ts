import { ConnectionPool,Connection } from '../..';
import {PgConnection} from "./PgConnection";
const Pool = require('pg-pool');
/* istanbul ignore file */
export class PgConnectionPool implements ConnectionPool{
	pool: any;
/*	public async open(config:any):Promise<void> {
		this.pool = new Pool(config);
	}*/

	public async getConnection():Promise<Connection> {
		var client = await this.pool.connect();
		var conn:Connection = new PgConnection(client);		
		return conn;
	}
	public async close():Promise<void> {
		await this.pool.end()
		
	}

}