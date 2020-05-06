import { ConnectionPool, Connection } from '../db';
import { ApplicationContextConfig } from './ApplicationContextConfig';



export class ApplicationContext {

	protected static GUID_CONNECTION = '71ee8f39-0d11-48d8-87f1-a1a9025ce7fd';
	public static DEFAULT: ApplicationContext;
	protected pool: ConnectionPool;
	
	protected clsSession: any;

	public constructor(config: ApplicationContextConfig) {
		this.pool = config.pool;
		this.clsSession = config.cls;
	}
	public transaction(func: Function) {
		const rt = this.clsSession.runAndReturn(async () => {
			const conn = await this.getConnection();
			try {
				await conn.setAutoCommit(false);
				const result = await func();
				await conn.commit();
				return result;
			} catch (error) {
				await conn.rollback();
				throw error;
			} finally {
				await conn.close();
			}
		});
		return rt;
	}
	public autoCommit(func: Function) {
		const rt = this.clsSession.runAndReturn(async () => {
			const conn = await this.getConnection();
			try {
				await conn.setAutoCommit(false);
				const result = await func();				
				return result;
			} catch (error) {
				throw error;
			} finally {
				await conn.close();
			}
		});
		return rt;
	}
	public async getConnection(): Promise<Connection> {
		let conn = this.clsSession.get(ApplicationContext.GUID_CONNECTION);
		if(conn === undefined) {
			conn = await this.pool.getConnection();
			this.clsSession.set(ApplicationContext.GUID_CONNECTION, conn);
		}
		return conn;
	}
}