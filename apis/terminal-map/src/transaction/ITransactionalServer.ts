import { IContext } from '@airport/direction-indicator'
import {
	IAirEntity,
	ISaveResult,
	PortableQuery
} from '@airport/ground-control'
import { IEntityContext } from '@airport/tarmaq-entity'
import { Observable } from 'rxjs'
import {
	ICredentials,
	ITransactionCredentials
} from '../ICredentials'
import { IQueryOperationContext } from '../processing/IOperationContext'

export interface ITransactionalServer {

	init(
		context?: IContext,
	): Promise<void>

	find<E, EntityArray extends Array<E>>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IQueryOperationContext
	): Promise<EntityArray>

	findOne<E>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IQueryOperationContext
	): Promise<E>

	search<E, EntityArray extends Array<E>>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IQueryOperationContext
	): Observable<EntityArray>

	searchOne<E>(
		portableQuery: PortableQuery,
		credentials: ICredentials,
		context: IQueryOperationContext
	): Observable<E>

	startTransaction(
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<boolean>

	commit(
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<boolean>

	rollback(
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<boolean>

	save<E extends IAirEntity, T = E | E[]>(
		entity: T,
		credentials: ITransactionCredentials,
		context: IEntityContext,
	): Promise<ISaveResult>

	saveToDestination<E extends IAirEntity, T = E | E[]>(
		repositoryDestination: string,
		entity: T,
		credentials: ITransactionCredentials,
		context: IEntityContext,
	): Promise<ISaveResult>

	insertValues(
		portableQuery: PortableQuery,
		credentials: ITransactionCredentials,
		context: IContext,
		ensureGeneratedValues?: boolean // For internal use only
	): Promise<number>

	insertValuesGetLocalIds(
		portableQuery: PortableQuery,
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<number[][]>

	updateValues(
		portableQuery: PortableQuery,
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<number>

	deleteWhere(
		portableQuery: PortableQuery,
		credentials: ITransactionCredentials,
		context: IContext
	): Promise<number>

}
