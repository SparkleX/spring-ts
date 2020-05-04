import {SqlJsConnection, initSqlJs} from ".."
import {Connection} from "../../db"

//import { sqlTest, transactionTest } from "./TestCase"


test("Metadata.loadAll", async () => {
		var SQL = await initSqlJs();
		var conn: Connection = new SqlJsConnection();
		await conn.open(SQL);
		await conn.execute("create table test (id integer primary key, name);");
		await sqlTest(conn);
		await transactionTest(conn);
		await conn.close();
});

export async function sqlTest(conn:Connection):Promise<void> {

	var isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	expect(isResult.updateCount).toBe(1);
	isResult = await conn.execute("insert into test(id, name) values(?,?)", [2,'b']);
	expect(isResult.updateCount).toBe(1);

	isResult = await conn.execute("insert into test(id, name) values(3,'c')");
	expect(isResult.updateCount).toBe(1);

	var resultSet = await conn.executeQuery('select * from test');
	expect(resultSet.length).toBe(3);
	expect(resultSet[0].id).toBe(1);
	expect(resultSet[1].id).toBe(2);

	resultSet = await conn.executeQuery('select * from test where id=?',[1]);
	expect(resultSet.length).toBe(1);
	expect(resultSet[0].id).toBe(1);

	isResult = await conn.execute("delete from test");
	expect(isResult.updateCount).toBe(3);
	return;
}
export async function transactionTest(conn:Connection):Promise<void> {
	await transactionCommit(conn);
	await transactionRollback(conn);

}
export async function transactionRollback(conn:Connection):Promise<void> {
	await conn.setAutoCommit(true);
	var isResult = await conn.execute("delete from test");
	await conn.setAutoCommit(false);
	isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	await conn.rollback();
	isResult = await conn.execute('select * from test');
	expect(isResult.data.length).toBe(0);
	return;
}

export async function transactionCommit(conn:Connection):Promise<void> {
	await conn.setAutoCommit(true);
	var isResult = await conn.execute("delete from test");
	await conn.setAutoCommit(false);
	isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	await conn.commit();
	isResult = await conn.execute('select * from test');
	expect(isResult.data.length).toBe(1);
	return;
}