import { createNamespace } from 'cls-hooked';
import { SqlJsConnectionPool, ApplicationContext, Connection, initSqlJs, txTransaction, logger } from '../../src';




test("test", async () => {
	var SQL = await initSqlJs();
	const session = createNamespace('clsSession');
	const pool = new SqlJsConnectionPool(SQL);
	const context = new ApplicationContext({
		cls: session,
		pool: pool
	});
	
	ApplicationContext.DEFAULT = context;
	
	await txTransaction(async() =>{
		const conn: Connection = await context.getConnection();
		let result = await conn.execute('create table test (id integer primary key, name);');
		console.debug(result);
		result = await conn.execute("insert into test(id, name) values(1, 'a')");
		logger.info(result);
		result = await conn.execute("select * from test");
		logger.info(result);
	});
});