import { ConnectionPool } from "../db";

export interface ApplicationContextConfig {
	pool: ConnectionPool,
	cls: any;
}