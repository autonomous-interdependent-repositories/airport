import {
	DbEntity,
	QueryResultType
} from '@airport/ground-control'
import {
	IEntityContext,
	IEntityQueryContext
} from '../../../lingo/core/EntityContext'
import { IEntitySelectProperties } from '../../../lingo/core/entity/Entity'
import { IEntityLookup } from '../../../lingo/query/api/EntityLookup'
import { RawEntityQuery } from '../../../lingo/query/facade/EntityQuery'
import { IDaoStub, LookupProxy } from './Lookup'

export interface IEntityLookupInternal<Child, MappedChild,
	IESP extends IEntitySelectProperties>
	extends IEntityLookup<Child, MappedChild> {

	entityLookup(
		rawEntityQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		queryResultType: QueryResultType,
		search: boolean,
		one: boolean,
		context: IEntityContext
	): Promise<any>

	setMap(
		MappedChildClass: new (
			dbEntity: DbEntity,
			dao: IDaoStub,
			mapResults: boolean
		) => MappedChild,
		isMapped: boolean
	): MappedChild

	setNoCache(
		ChildClass: new (
			dbEntity: DbEntity,
			dao: IDaoStub,
			mapResults: boolean
		) => Child
	): Child

}

export abstract class EntityLookup<Child, MappedChild,
	IESP extends IEntitySelectProperties>
	extends LookupProxy
	implements IEntityLookupInternal<Child, MappedChild, IESP> {

	static mapResults = false

	constructor(
		protected dbEntity: DbEntity,
		dao: IDaoStub,
		protected mapResults = EntityLookup.mapResults,
	) {
		super(dao)
	}

	abstract map(
		isMapped?: boolean
	): MappedChild

	setMap(
		MappedChildClass: new (
			dbEntity: DbEntity,
			dao: IDaoStub,
			mapResults: boolean
		) => MappedChild,
		isMapped = true
	): MappedChild {
		return new MappedChildClass(this.dbEntity, this.dao, isMapped)
	}

	setNoCache(
		ChildClass: new (
			dbEntity: DbEntity,
			dao: IDaoStub,
			mapResults: boolean
		) => Child
	): Child {
		return new ChildClass(this.dbEntity, this.dao, this.mapResults)
	}

	async entityLookup(
		rawEntityQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		queryResultType: QueryResultType,
		search: boolean,
		one: boolean,
		context: IEntityQueryContext
	): Promise<any> {
		context.dbEntity = this.dbEntity

		const result = await this.lookup(rawEntityQuery, queryResultType,
			search, one, null, context, this.mapResults)
		if (search) {
			throw new Error(`Search operations are not yet supported`);
		} else {
			this.dao.updateCacheManager.saveOriginalValues(result, context.dbEntity)
		}
		return result
	}

}