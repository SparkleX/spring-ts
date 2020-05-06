import { ConnectionPool } from "../../../ConnectionPool";
import { SqlJsConnectionPool } from "../SqlJsConnectionPool";
import { initSqlJs } from "../SqlJsInit";

test("pool", async () => {
	var SQL = await initSqlJs();
	const pool: ConnectionPool = new SqlJsConnectionPool(SQL);
	const conn = await pool.getConnection();
	conn.close();
	pool.close();
});