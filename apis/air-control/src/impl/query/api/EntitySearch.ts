import {
	DI,
	IContext
}                                  from '@airport/di';
import { QueryResultType }         from '@airport/ground-control';
import {
	Observable,
	from
}                                  from 'rxjs';
import { IEntityContext }          from '../../../lingo/core/EntityContext';
import { IEntitySelectProperties } from '../../../lingo/core/entity/Entity';
import { IEntitySearch }           from '../../../lingo/query/api/EntitySearch';
import { RawEntityQuery }          from '../../../lingo/query/facade/EntityQuery';
import { MappedEntityArray }       from '../../../lingo/query/MappedEntityArray';
import { EntityLookup }            from './EntityLookup';

export interface IEntitySearchInternal<Entity, EntityArray extends Array<Entity>,
	IESP extends IEntitySelectProperties>
	extends IEntitySearch<Entity, EntityArray, IESP> {

	search(
		rawEntityQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		queryResultType: QueryResultType,
		context?: IContext
	): Promise<EntityArray>

}

/**
 * Created by Papa on 11/12/2016.
 */
export class EntitySearch<Entity, EntityArray extends Array<Entity>, IESP extends IEntitySelectProperties>
	extends EntityLookup<EntitySearch<Entity, Array<Entity>, IESP>,
		EntitySearch<Entity, MappedEntityArray<Entity>, IESP>, IESP>
	implements IEntitySearchInternal<Entity, EntityArray, IESP> {

	graph(
		rawGraphQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		context?: IContext
	): Observable<EntityArray> {
		return from(this.search(rawGraphQuery, QueryResultType.ENTITY_TREE, context));
	}

	tree(
		rawTreeQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		context?: IContext
	): Observable<EntityArray> {
		return from(this.search(rawTreeQuery, QueryResultType.ENTITY_TREE, context));
	}

	search(
		rawEntityQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		queryResultType: QueryResultType,
		context?: IContext
	): Promise<EntityArray> {
		return this.entityLookup(rawEntityQuery, queryResultType,
			true, false, this.ensureContext(context) as IEntityContext);
	}

	map(
		isMapped?: boolean
	): EntitySearch<Entity, MappedEntityArray<Entity>, IESP> {
		return this.setMap(EntitySearch, isMapped);
	}

	noCache(): EntitySearch<Entity, Entity[], IESP> {
		return this.setNoCache(EntitySearch);
	}

}
