import { initSqlJs } from "../SqlJsInit";
import { SqlJsConnection } from "../SqlJsConnection";
import { Connection } from "../../../Connection";




test("test", async () => {
	var SQL = await initSqlJs();
	const conn: Connection = new SqlJsConnection(SQL);
	conn.setAutoCommit(true);
	let result = await conn.execute('create table test (id integer primary key, name);');
	result = await conn.execute("insert into test(id, name) values(1, 'a')");
	let list = await conn.executeQuery("select * from test");
	expect(list).toStrictEqual([{id:1, name:'a'}]);
});

test("commit", async () => {
	var SQL = await initSqlJs();
	const conn: Connection = new SqlJsConnection(SQL);
	conn.setAutoCommit(false);
	let result = await conn.execute('create table test (id integer primary key, name);');
	result = await conn.execute("insert into test(id, name) values(1, 'a')");
	result = await conn.execute("select * from test");
	conn.commit();
});

test("rollback", async () => {
	var SQL = await initSqlJs();
	const conn: Connection = new SqlJsConnection(SQL);
	conn.setAutoCommit(false);
	let result = await conn.execute('create table test (id integer primary key, name);');
	result = await conn.execute("insert into test(id, name) values(1, 'a')");
	result = await conn.execute("select * from test");
	conn.rollback();
});