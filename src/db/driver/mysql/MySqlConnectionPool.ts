import { ConnectionPool,Connection } from '../..';
import * as mysql from 'mysql';
import { MySqlConnection } from './MySqlConnection';
 
export class MySqlConnectionPool implements ConnectionPool{
	private pool: mysql.Pool;
	public constructor(config: string | mysql.PoolConfig) {
		this.pool  = mysql.createPool(config);
	}
	public async getConnection():Promise<Connection> {
		var mySqlConn = await this._getConnection();
		var conn: Connection = new MySqlConnection(mySqlConn);
		return conn;
	}
	private async _getConnection(): Promise<mysql.PoolConnection> {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.pool.getConnection(function(err: mysql.MysqlError, connection: mysql.PoolConnection) {
				if(err) {
					reject(err);
					return;
				}
				resolve(connection);
			});	
		});
	} 
	public async close():Promise<void> {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.pool.end(function (err: mysql.MysqlError) {
				/* istanbul ignore next */
				if(err) {
					reject(err);
					return;
				}
				resolve();
			});
		});		
	}
}