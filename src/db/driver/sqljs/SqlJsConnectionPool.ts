import { ConnectionPool,Connection } from '../..';
import {SqlJsConnection} from "./SqlJsConnection";

export class SqlJsConnectionPool implements ConnectionPool{
	private conn: SqlJsConnection;

	public constructor(config: any) {
		this.conn = new SqlJsConnection(config);
	}

	public async getConnection():Promise<Connection> {
		return this.conn;
	}
	public async close():Promise<void> {
		
	}
}