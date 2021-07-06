import {
	container,
	DI,
	IContext
}                      from '@airport/di';
import {
	JsonInsertValues,
	PortableQuery
}                      from '@airport/ground-control';
import { IActor }      from '@airport/holding-pattern';
import {
	DistributionStrategy,
	ICredentials,
	PlatformType,
	TRANSACTION_MANAGER
}                      from '@airport/terminal-map';
import {
	ITransactionalServer,
	TRANSACTIONAL_SERVER
}                      from '@airport/tower';
import { Observable } from 'rxjs';
import { IOperationContext } from '../processing/OperationContext';
import {
	OPERATION_CONTEXT_LOADER
}                      from '../tokens';
import { ITransaction } from '../transaction/ITransaction';
import { transactional } from '../transaction/transactional';

export interface InternalPortableQuery
	extends PortableQuery {
	domainAndPort: string
}

/**
 * Keeps track of transactions, per client and validates that a given
 * transaction belongs to the provided client.  If the connection
 * information matches, passes the transaction for handling.
 *
 * All transactions are queued.  Read operations are not blocked while
 * any transaction is in progress.  Best way to make sure that you get
 * the latest state is to subscribe to a query, which is guaranteed to
 * be updated after data has changed.
 *
 *
 * Should read operations be blocked while transactions are in process?
 * Probably not since they will just get snapshot of the state at any
 * given point in time and transactionality takes care of not exposing
 * inconsistent state.  There doesn't appear to be a need to que-up
 * read transactions, since SqLite can handle it:
 *
 * https://www.skoumal.net/en/parallel-read-and-write-in-sqlite/
 *
 * Also, there doesn't appear to be a reason to prioritize remote transactions
 * over local ones, since ultimately the state needs to sync either way.
 * A single transactional queue should be enough.
 *
 */
export class TransactionalServer
	implements ITransactionalServer {

	tempActor: IActor;

	async init(
		context: IContext = {}
	): Promise<void> {
		const transManager = await container(this)
			.get(TRANSACTION_MANAGER);

		return await transManager.initialize('airport', context);
	}

	async addRepository(
		name: string,
		url: string,
		platform: PlatformType,
		platformConfig: string,
		distributionStrategy: DistributionStrategy,
		credentials: ICredentials,
		context: IOperationContext<any, any>
	): Promise<number> {
		await this.ensureIocContext(context)

		const actor = await this.getActor(credentials);

		// FIXME: check actor

		return await context.ioc.insertManager.addRepository(name, url, platform,
			platformConfig, distributionStrategy);
	}

	async find<E, EntityArray extends Array<E>>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
		cachedSqlQueryId?: number,
	): Promise<EntityArray> {
		await this.ensureIocContext(context)

		return await context.ioc.queryManager.find<E, EntityArray>(
			portableQuery, context, cachedSqlQueryId);
	}

	async findOne<E>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
		cachedSqlQueryId?: number,
	): Promise<E> {
		await this.ensureIocContext(context)

		return await context.ioc.queryManager.findOne<E>(
			portableQuery, context, cachedSqlQueryId);
	}

	async search<E, EntityArray extends Array<E>>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
		cachedSqlQueryId?: number,
	): Promise<Observable<EntityArray>> {
		await this.ensureIocContext(context)

		return await context.ioc.queryManager.search<E, EntityArray>(
			portableQuery, context);
	}

	async searchOne<E>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
		cachedSqlQueryId?: number,
	): Promise<Observable<E>> {
		await this.ensureIocContext(context)

		return await context.ioc.queryManager.searchOne<E>(portableQuery, context);
	}

	async save<E>(
		entity: E,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
	): Promise<number> {
		if (!entity) {
			return 0
		}
		await this.ensureIocContext(context)

		const actor = await this.getActor(credentials);

		let numSavedRecords = 0
		await transactional(async (
			transaction: ITransaction
		) => {
			numSavedRecords = await context.ioc.operationManager.performSave(
				entity, actor, transaction, context)
		})

		return numSavedRecords
	}

	async insertValues(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>,
		ensureGeneratedValues?: boolean // for internal use only
	): Promise<number> {
		const values = (portableQuery.jsonQuery as JsonInsertValues).V;
		if (!values.length) {
			return 0;
		}
		const firstValuesRow = values[0];

		if (!firstValuesRow || !firstValuesRow.length) {
			return 0;
		}

		const numValuesInRow = firstValuesRow.length;

		for (let valuesRow of values) {
			if (valuesRow.length !== numValuesInRow) {
				return 0;
			}
		}

		const actor = await this.getActor(credentials);
		
		let numInsertedRecords
		await transactional(async (
			transaction: ITransaction
		) => {
			numInsertedRecords = await context.ioc.insertManager.insertValues(
				portableQuery, actor, transaction, context, ensureGeneratedValues);
		})

		return numInsertedRecords
	}

	async insertValuesGetIds(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>
	): Promise<number[] | string[] | number[][] | string[][]> {
		const actor = await this.getActor(credentials);
		
		let numInsertedRecords
		await transactional(async (
			transaction: ITransaction
		) => {
			numInsertedRecords = await context.ioc.insertManager.insertValuesGetIds(
				portableQuery, actor, transaction, context);
		})

		return numInsertedRecords
	}

	async updateValues(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>
	): Promise<number> {
		const actor = await this.getActor(credentials);

		let numUpdatedRecords
		await transactional(async (
			transaction: ITransaction
		) => {
			numUpdatedRecords = await context.ioc.updateManager.updateValues(
				portableQuery, actor, transaction, context);
		})

		return numUpdatedRecords
	}

	async deleteWhere(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IOperationContext<any, any>
	): Promise<number> {
		const actor = await this.getActor(credentials);

		let numDeletedRecords
		await transactional(async (
			transaction: ITransaction
		) => {
			numDeletedRecords = await context.ioc.deleteManager.deleteWhere(
				portableQuery, actor, transaction, context);
		})

		return numDeletedRecords
	}

	private async getActor(
		credentials: ICredentials,
	): Promise<IActor> {
		if (this.tempActor) {
			return this.tempActor;
		}

		throw new Error(`Not Implemented`);
	}

	private async ensureIocContext(
		context: IOperationContext<any, any>
	): Promise<void> {
		const operationContextLoader = await container(this)
			.get(OPERATION_CONTEXT_LOADER)
		await operationContextLoader.ensure(context)
	}

}

DI.set(TRANSACTIONAL_SERVER, TransactionalServer);

export function injectTransactionalServer(): void {
	// console.log('Injecting TransactionalServer')
}
