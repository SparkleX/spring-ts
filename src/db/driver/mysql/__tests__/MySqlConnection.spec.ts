import { Connection } from "../../../Connection";

import { MySqlConnection } from ".."
import { Result } from "../../..";

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
//flush privileges;

const config = {
	host     : 'localhost',
	user     : 'root',
	password : '1234'
};

test("test", async () => {
	const conn: Connection = await MySqlConnection.getConnection(config);
	await conn.execute('drop schema if exists test');
	await conn.execute('create schema test');
	await conn.execute('use test');
	await conn.execute('create table test (id int,data varchar(45),primary key(id))');
	var result: Result;
	result = await conn.execute("insert into test(id, data) values(1, 'a')");
	expect(result.updateCount).toBe(1);
	result = await conn.execute("insert into test(id, data) values(?, ?)", [2, 'b']);
	expect(result.updateCount).toBe(1);
	result = await conn.execute("insert into test(id, data) values(3, ?)", ['c']);
	expect(result.updateCount).toBe(1);

	var list = await conn.executeQuery("select * from test");
	expect(list).toEqual([{id:1, data:'a'},{id:2, data:'b'},{id:3, data:'c'}]);
	await conn.close();
});
test("connect failed", async () => {
	expect.assertions(1);
	try {
		await MySqlConnection.getConnection({
			host     : 'localhost',
			user     : 'root',
			password : '****'
		});
	} catch (e) {
		expect(e.errno).toBe(1045);
	}	
});
test("query failed", async () => {
	expect.assertions(1);
	const conn: Connection = await MySqlConnection.getConnection(config);
	try {
		await conn.execute('syntax error');
	} catch (e) {
		expect(e.errno).toBe(1064);
	}	
	await conn.close();
});
test("auto commit true", async () => {
	const conn: Connection = await MySqlConnection.getConnection(config);
	await conn.execute('drop schema if exists test');
	await conn.execute('create schema test');
	await conn.execute('use test');
	await conn.execute('create table test (id int,data varchar(45),primary key(id))');
	var result: Result;
	await conn.setAutoCommit(true);
	await conn.setAutoCommit(false);
	await conn.setAutoCommit(true);
	result = await conn.execute("insert into test(id, data) values(1, 'a')");
	expect(result.updateCount).toBe(1);
	var list = await conn.executeQuery("select * from test");
	expect(list.length).toEqual(1);
	await conn.close();
});
test("commit", async () => {
	const conn: Connection = await MySqlConnection.getConnection(config);
	await conn.execute('drop schema if exists test');
	await conn.execute('create schema test');
	await conn.execute('use test');
	await conn.execute('create table test (id int,data varchar(45),primary key(id))');
	var result: Result;
	await conn.setAutoCommit(false);
	result = await conn.execute("insert into test(id, data) values(1, 'a')");
	expect(result.updateCount).toBe(1);
	await conn.commit();
	var list = await conn.executeQuery("select * from test");
	expect(list.length).toEqual(1);
	await conn.close();
});

test("rollback", async () => {
	const conn: Connection = await MySqlConnection.getConnection(config);
	await conn.execute('drop schema if exists test');
	await conn.execute('create schema test');
	await conn.execute('use test');
	await conn.execute('create table test (id int,data varchar(45),primary key(id))');
	var result: Result;
	await conn.setAutoCommit(false);
	result = await conn.execute("insert into test(id, data) values(1, 'a')");
	expect(result.updateCount).toBe(1);
	await conn.rollback();
	var list = await conn.executeQuery("select * from test");
	expect(list.length).toEqual(0);
	await conn.close();
});