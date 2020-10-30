import {DI}            from '@airport/di'
import {
	SQLDialect,
	SqlDriver
}                      from '@airport/fuel-hydrant-system'
import {
	ITransaction,
	QueryType,
	SQLDataType,
	STORE_DRIVER
}                      from '@airport/ground-control'
import {transactional} from '@airport/tower'
import {
	FieldPacket,
	OkPacket,
	QueryOptions,
	ResultSetHeader,
	RowDataPacket
}                      from 'mysql2'
import * as mysql      from 'mysql2/promise'
import {
	Connection,
	Pool
}                      from 'mysql2/promise'
import {DDLManager}    from './DDLManager'

/**
 * Created by Papa on 10/16/2020.
 */

export interface IQueryApi {
	query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		sql: string
	): Promise<[T, FieldPacket[]]>;

	query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		sql: string,
		values: any | any[] | { [param: string]: any }
	): Promise<[T, FieldPacket[]]>;

	query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		options: QueryOptions
	): Promise<[T, FieldPacket[]]>;

	query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		options: QueryOptions,
		values: any | any[] | { [param: string]: any }
	): Promise<[T, FieldPacket[]]>;

	execute<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		sql: string
	): Promise<[T, FieldPacket[]]>;

	execute<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		sql: string,
		values: any | any[] | { [param: string]: any }
	): Promise<[T, FieldPacket[]]>;

	execute<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		options: QueryOptions
	): Promise<[T, FieldPacket[]]>;

	execute<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
		options: QueryOptions,
		values: any | any[] | { [param: string]: any }
	): Promise<[T, FieldPacket[]]>;
}

export class MySqlDriver
	extends SqlDriver {

	protected pool: Pool
	protected queryApi: IQueryApi

	async query(
		queryType: QueryType,
		query: string,
		params: any,
		saveTransaction?: boolean
	): Promise<any> {
		return await this.doQuery(queryType, query, params, this.queryApi, saveTransaction)
	}

	async doQuery(
		queryType: QueryType,
		query: string,
		params: any,
		connection: IQueryApi,
		saveTransaction?: boolean
	): Promise<any> {
		let nativeParameters = params.map((value) => this.convertValueIn(value))
		const results        = await connection.query(query, nativeParameters)

		return results[0]
	}


	initialize(dbName: string): Promise<any> {
		this.pool     = mysql.createPool({
			host: 'localhost',
			user: 'root',
			database: dbName,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		})
		this.queryApi = this.pool

		return null
	}

	numFreeConnections(): number {
		return (<any>this.pool)._freeConnections.length
	}

	isServer(): boolean {
		return true
	}

	async transact(keepAlive?: boolean): Promise<ITransaction> {
		const connection: Connection = await this.pool.getConnection()
		await connection.beginTransaction()
		const transactionModule = await import('./MySqlTransaction')
		return new transactionModule.MySqlTransaction(this, this.pool, connection)
	}

	isValueValid(
		value: any,
		sqlDataType: SQLDataType
	): boolean {
		throw new Error('Method not implemented.')
	}

	async doesTableExist(
		schemaName: string,
		tableName: string
	): Promise<boolean> {
		const result = await this.findNative(
			// ` SELECT tbl_name, sql from sqlite_master WHERE type = '${tableName}'`,
			`select count(1) from information_schema.TABLES
where TABLE_SCHEMA = '${schemaName}'
and TABLE_NAME = '${tableName}';`,
			[]
		)

		return result == 1
	}

	async dropTable(
		schemaName: string,
		tableName: string
	): Promise<boolean> {
		await this.findNative(
			`DROP TABLE '${schemaName}'.'${tableName}'`,
			[]
		)

		return true
	}

	async findNative(
		sqlQuery: string,
		parameters: any[]
	): Promise<any> {
		return await this.query(QueryType.SELECT, sqlQuery, parameters)
	}

	async initAllTables(): Promise<any> {
		let createOperations
		let createQueries: Promise<any>[] = []
		let createSql                     = DDLManager.getCreateDDL()
		await transactional(async () => {
			for (const createSqlStatement of createSql) {
				const createTablePromise = this.query(QueryType.DDL, createSqlStatement, [], false)
				createQueries.push(createTablePromise)
			}

			await this.initTables(createQueries)
		})
	}

	async initTables(
		createQueries: Promise<any>[]
	): Promise<void> {
		for (let i = 0; i < createQueries.length; i++) {
			let currentQuery = createQueries[i]
			await currentQuery
		}
	}

	protected getDialect(): import('@airport/fuel-hydrant-system').SQLDialect {
		return SQLDialect.MYSQL
	}

	protected async executeNative(
		sql: string,
		parameters: any[]
	): Promise<number> {
		return await this.query(QueryType.MUTATE, sql, parameters)
	}

	protected convertValueIn(
		value: any
	): any {
		switch (typeof value) {
			case 'boolean':
			// return value ? 1 : 0
			case 'number':
			case 'string':
				return value
			case 'undefined':
				return null
			case 'object':
				if (!value) {
					return null
				} else if (value instanceof Date) {
					// return value.getTime()
					return value
				} else {
					throw new Error(`Unexpected non-date object ${value}`)
				}
			default:
				throw new Error(`Unexpected typeof value: ${typeof value}`)
		}
	}

}

DI.set(STORE_DRIVER, MySqlDriver)
