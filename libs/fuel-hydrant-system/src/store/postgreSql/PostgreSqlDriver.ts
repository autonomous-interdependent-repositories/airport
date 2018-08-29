import { QueryType }     from "@airport/ground-control";
import { Transactional } from "@airport/tower";
import { SqlDriver }     from "../SqlDriver";
import { DDLManager }    from "./DDLManager";

/**
 * Created by Papa on 11/27/2016.
 */

export abstract class PostgreSqlDriver extends SqlDriver {

	async findNative(
		sqlQuery: string,
		parameters: any[]
	): Promise<any[]> {
		let nativeParameters = parameters.map((value) => this.convertValueIn(value));
		return await this.query(QueryType.SELECT, sqlQuery, nativeParameters);
	}

	protected async executeNative(
		sql: string,
		parameters: any[]
	): Promise<number> {
		return await this.query(QueryType.MUTATE, sql, parameters);
	}


	protected convertValueIn(
		value: any
	): number | string {
		switch (typeof value) {
			case 'boolean':
				return value ? 1 : 0;
			case 'number':
			case 'string':
				return value;
			case 'undefined':
				return null;
			case 'object':
				if (!value) {
					return null;
				} else if (value instanceof Date) {
					return value.getTime();
				} else {
					throw `Unexpected non-date object ${value}`;
				}
			default:
				throw `Unexpected typeof value: ${typeof value}`;
		}
	}

	protected abstract async query(
		queryType: QueryType,
		query: string,
		params,
		saveTransaction?: boolean
	): Promise<any>;

	@Transactional()
	async initAllTables(): Promise<any> {
		let createOperations;
		let createQueries: Promise<any>[] = [];
		let createSql = DDLManager.getCreateDDL();
		for (const createSqlStatement of createSql) {
			const createTablePromise = this.query(QueryType.DDL, createSqlStatement, [], false);
			createQueries.push(createTablePromise);
		}

		await this.initTables(createQueries);
	}

	async initTables(
		createQueries: Promise<any>[]
	): Promise<void> {
		for (let i = 0; i < createQueries.length; i++) {
			let currentQuery = createQueries[i];
			await currentQuery;
		}
	}

}