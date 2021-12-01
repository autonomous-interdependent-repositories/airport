import {
	DATABASE_FACADE,
	Delete,
	IDatabaseFacade,
	IEntityContext,
	IEntityUpdateColumns,
	IEntityUpdateProperties,
	IFunctionWrapper,
	InsertColumnValues,
	InsertValues,
	IQEntity,
	IQueryContext,
	QUERY_CONTEXT_LOADER,
	RawDelete,
	RawInsertColumnValues,
	RawInsertValues,
	RawUpdate,
	RawUpdateColumns,
	SCHEMA_UTILS,
	UPDATE_CACHE_MANAGER,
	UpdateColumns,
	UpdateProperties,
} from '@airport/air-control'
import {
	container,
	DI,
	IContext
} from '@airport/di'
import {
	ENTITY_STATE_MANAGER,
	ISaveResult,
	PortableQuery,
	TRANSACTIONAL_CONNECTOR
} from '@airport/ground-control'
import { ENTITY_COPIER } from '../tokens'

/**
 * Created by Papa on 5/23/2016.
 */
export class DatabaseFacade
	implements IDatabaseFacade {

	name: string

	async addRepository(
		// url: string = null,
		// platform: PlatformType = PlatformType.GOOGLE_DOCS,
		// platformConfig: string = null,
		// distributionStrategy: DistributionStrategy = DistributionStrategy.S3_DISTIBUTED_PUSH,
		context?: IContext
	): Promise<number> {
		// TODO: figure out how addRepository will work
		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR)

		return await transactionalConnector.addRepository(
			// url, platform, platformConfig, distributionStrategy, 
			context
		)
	}

	async insertColumnValues<IQE extends IQEntity<any>>(
		rawInsertColumnValues: RawInsertColumnValues<IQE> | {
			(...args: any[]): RawInsertColumnValues<IQE>;
		},
		context: IContext
	): Promise<number> {
		if (!rawInsertColumnValues) {
			return 0
		}
		if (rawInsertColumnValues instanceof Function) {
			rawInsertColumnValues = rawInsertColumnValues()
		}
		const insertColumnValues: InsertColumnValues<IQE> = new InsertColumnValues(rawInsertColumnValues)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			insertColumnValues, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.insertValues(portableQuery, context)
	}

	async insertValues<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertValues<IQE> | { (...args: any[]): RawInsertValues<IQE> },
		context: IContext
	): Promise<number> {
		if (!rawInsertValues) {
			return 0
		}
		if (rawInsertValues instanceof Function) {
			rawInsertValues = rawInsertValues()
		}
		const insertValues: InsertValues<IQE> = new InsertValues(rawInsertValues)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			insertValues, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.insertValues(portableQuery, context)
	}

	async insertColumnValuesGenerateIds<IQE extends IQEntity<any>>(
		rawInsertColumnValues: RawInsertColumnValues<IQE> | {
			(...args: any[]): RawInsertColumnValues<IQE>;
		},
		context: IContext
	): Promise<number[][] | string[][]> {
		if (!rawInsertColumnValues) {
			return []
		}
		if (rawInsertColumnValues instanceof Function) {
			rawInsertColumnValues = rawInsertColumnValues()
		}
		const insertValues: InsertColumnValues<IQE> = new InsertColumnValues(rawInsertColumnValues)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			insertValues, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.insertValuesGetIds(portableQuery, context)
	}

	async insertValuesGenerateIds<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertValues<IQE> | {
			(...args: any[]): RawInsertValues<IQE>;
		},
		context: IContext
	): Promise<number[][] | string[][]> {
		if (!rawInsertValues) {
			return []
		}
		if (rawInsertValues instanceof Function) {
			rawInsertValues = rawInsertValues()
		}
		const insertValues: InsertValues<IQE> = new InsertValues(rawInsertValues)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			insertValues, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.insertValuesGetIds(portableQuery, context)
	}

	async deleteWhere<IQE extends IQEntity<any>>(
		rawDelete: RawDelete<IQE> | {
			(...args: any[]): RawDelete<IQE>
		},
		context: IContext
	): Promise<number> {
		if (!rawDelete) {
			return 0
		}
		if (rawDelete instanceof Function) {
			rawDelete = rawDelete()
		}
		let deleteWhere: Delete<IQE> = new Delete(rawDelete)
		const queryContext = await this.ensureQueryContext(context)
		let portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			deleteWhere, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.deleteWhere(portableQuery, context)
	}

	async save<E>(
		entity: E,
		context: IEntityContext,
	): Promise<ISaveResult> {
		if (!entity) {
			return null
		}
		const entityCopy = await this.preSaveOperations(entity, context)

		const [updateCacheManager, entityStateManager, applicationUtils,
			transactionalConnector] = await container(this).get(UPDATE_CACHE_MANAGER,
				ENTITY_STATE_MANAGER, SCHEMA_UTILS, TRANSACTIONAL_CONNECTOR)

		const saveResult = await transactionalConnector.save(entityCopy, context)

		updateCacheManager.afterSaveModifications(entity, context.dbEntity, saveResult,
			entityStateManager, applicationUtils, new Set())

		return saveResult
	}

	async saveToDestination<E>(
		repositoryDestination: string,
		entity: E,
		context: IEntityContext,
	): Promise<ISaveResult> {
		if (!entity) {
			return null
		}
		const entityCopy = await this.preSaveOperations(entity, context)

		const [updateCacheManager, entityStateManager, applicationUtils,
			transactionalConnector] = await container(this).get(UPDATE_CACHE_MANAGER,
				ENTITY_STATE_MANAGER, SCHEMA_UTILS, TRANSACTIONAL_CONNECTOR)

		const saveResult = await transactionalConnector
			.saveToDestination(repositoryDestination, entityCopy, context)

		updateCacheManager.afterSaveModifications(entity, context.dbEntity, saveResult,
			entityStateManager, applicationUtils, new Set())

		return saveResult
	}

	private async preSaveOperations<E>(
		entity: E,
		context: IEntityContext,
	): Promise<E> {
		if (!entity) {
			return null
		}
		const [updateCacheManager, entityCopier, entityStateManager, applicationUtils]
			= await container(this).get(UPDATE_CACHE_MANAGER, ENTITY_COPIER,
				ENTITY_STATE_MANAGER, SCHEMA_UTILS, TRANSACTIONAL_CONNECTOR)

		const dbEntity = context.dbEntity;
		const entityCopy = entityCopier
			.copyEntityForProcessing(entity, dbEntity, entityStateManager)
		updateCacheManager.setOperationState(
			entityCopy, dbEntity, entityStateManager, applicationUtils, new Set())

		return entityCopy
	}

	/**
	 * Updates an entity with a where clause, using a column based set clause
	 * - internal API.  Use the API provided by the IEntityDatabaseFacade.
	 *
	 * @return Number of records updated
	 */
	async updateColumnsWhere<IEUC extends IEntityUpdateColumns, IQE extends IQEntity<any>>(
		rawUpdate: RawUpdateColumns<IEUC, IQE>
			| {
				(...args: any[]): RawUpdateColumns<IEUC, IQE>
			},
		context: IContext
	): Promise<number> {
		if (!rawUpdate) {
			return 0
		}
		if (rawUpdate instanceof Function) {
			rawUpdate = rawUpdate()
		}

		let updateColumns: UpdateColumns<any, IQE> = new UpdateColumns(rawUpdate)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			updateColumns, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.updateValues(portableQuery, context)
	}

	async updateWhere<IEUP extends IEntityUpdateProperties,
		IQE extends IQEntity<any>>(
			rawUpdate: RawUpdate<IEUP, IQE> | {
				(...args: any[]): RawUpdate<IEUP, IQE>
			},
			context: IContext
		): Promise<number> {
		if (!rawUpdate) {
			return 0
		}
		if (rawUpdate instanceof Function) {
			rawUpdate = rawUpdate()
		}
		let update: UpdateProperties<any, IQE> = new UpdateProperties(rawUpdate)
		const queryContext = await this.ensureQueryContext(context)
		const portableQuery: PortableQuery = queryContext.ioc.queryFacade.getPortableQuery(
			update, null, queryContext)

		const transactionalConnector = await container(this).get(TRANSACTIONAL_CONNECTOR);
		return await transactionalConnector.updateValues(portableQuery, context)
	}

	prepare<QF extends Function>(
		queryFunction: QF
	): IFunctionWrapper<QF> {
		return <IFunctionWrapper<QF>><any>new FunctionWrapper<QF>(queryFunction)
	}

	private async ensureQueryContext<E>(
		context: IContext
	): Promise<IQueryContext> {
		const queryContext: IQueryContext = context as IQueryContext
		const queryContextLoader = await container(this).get(QUERY_CONTEXT_LOADER)
		await queryContextLoader.ensure(queryContext);

		return queryContext
	}

}

DI.set(DATABASE_FACADE, DatabaseFacade)

export class FunctionWrapper<QF extends Function>
	implements IFunctionWrapper<any> {

	constructor(queryFunction: QF) {
		throw new Error('Not Implemented')
	}

	find(...params: any[]): any {

	}
}
