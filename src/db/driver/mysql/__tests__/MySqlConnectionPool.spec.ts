import { Connection } from "../../../Connection";

import { MySqlConnection, MySqlConnectionPool } from ".."
import { Result, ConnectionPool } from "../../..";

const config = {
	host     : 'localhost',
	user     : 'root',
	password : '1234'
};


test("pool", async () => {
	const pool: ConnectionPool = new MySqlConnectionPool(config);
	const conn = await pool.getConnection();
	await conn.close();
	await pool.close();
});


test("pool connect failed", async () => {
	expect.assertions(1);
	try {
		const pool: ConnectionPool = new MySqlConnectionPool({
			host     : 'localhost',
			user     : 'root',
			password : '****'
		});
		const conn = await pool.getConnection();
	} catch (e) {
		expect(e.errno).toBe(1045);
	}	
});