import {DI}              from '@airport/di'
import {
	DbEntity,
	QueryResultType,
	TRANS_CONNECTOR
}                        from '@airport/ground-control'
import {
	ENTITY_UTILS,
	FIELD_UTILS,
	LOOKUP,
	QUERY_FACADE,
	QUERY_UTILS,
	SCHEMA_UTILS,
	UPDATE_CACHE
}                        from '../../../diTokens'
import {UpdateCacheType} from '../../../lingo/core/data/UpdateCacheType'
import {ILookup}         from '../../../lingo/query/api/Lookup'
import {IAbstractQuery}  from '../../../lingo/query/facade/AbstractQuery'
import {RawQuery,}       from '../../../lingo/query/facade/Query'

export class LookupProxy
	implements ILookup {

	lookup(
		rawQuery: RawQuery | { (...args: any[]): RawQuery },
		queryResultType: QueryResultType,
		search: boolean,
		one: boolean,
		QueryClass: new (rawNonEntityQuery: RawQuery) => IAbstractQuery,
		dbEntity?: DbEntity,
		cacheForUpdate?: UpdateCacheType,
		mapResults?: boolean
	): Promise<any> {
		return DI.get(LOOKUP).then(
			lookup => lookup.lookup(
				rawQuery, queryResultType, search, one,
				QueryClass, dbEntity, cacheForUpdate, mapResults))
	}
}

export class Lookup
	implements ILookup {

	async lookup(
		rawQuery: RawQuery | { (...args: any[]): RawQuery },
		queryResultType: QueryResultType,
		search: boolean,
		one: boolean,
		QueryClass: new (rawNonEntityQuery: RawQuery) => IAbstractQuery,
		dbEntity?: DbEntity,
		cacheForUpdate?: UpdateCacheType,
		mapResults?: boolean
	): Promise<any> {
		return await DI.get(
			ENTITY_UTILS, FIELD_UTILS, QUERY_FACADE, QUERY_UTILS,
			SCHEMA_UTILS, TRANS_CONNECTOR, UPDATE_CACHE
		).then(([
			        entityUtils, fieldUtils, queryFacade, queryUtils,
			        schemaUtils, transConnector, updateCache
		        ]) => {
			let query: IAbstractQuery

			if (QueryClass) {
				const rawNonEntityQuery = entityUtils.getQuery(rawQuery)
				query                   = new QueryClass(rawNonEntityQuery)
			} else {
				query           = entityUtils.getEntityQuery(rawQuery)
				queryResultType = this.getQueryResultType(queryResultType, mapResults)
			}
			let queryMethod
			if (search) {
				if (one) {
					queryMethod = queryFacade.searchOne
				} else {
					queryMethod = queryFacade.search
				}
			} else {
				if (one) {
					queryMethod = queryFacade.findOne
				} else {
					queryMethod = queryFacade.find
				}
			}

			let result = queryMethod.call(queryFacade, dbEntity, query,
				this.getQueryResultType(queryResultType, mapResults), fieldUtils,
				queryUtils, schemaUtils, transConnector, updateCache,
				cacheForUpdate)

			return result
		})
	}

	private getQueryResultType(
		baseQueryResultType: QueryResultType,
		mapResults: boolean
	): QueryResultType {
		switch (baseQueryResultType) {
			case QueryResultType.ENTITY_GRAPH:
				if (mapResults) {
					return QueryResultType.MAPPED_ENTITY_GRAPH
				}
				return QueryResultType.ENTITY_GRAPH
			case QueryResultType.ENTITY_TREE:
				if (mapResults) {
					return QueryResultType.MAPPED_ENTITY_TREE
				}
				return QueryResultType.ENTITY_TREE
			default:
				throw `Unexpected Base Query ResultType: '${baseQueryResultType}'.`
		}
	}

}

DI.set(LOOKUP, Lookup)