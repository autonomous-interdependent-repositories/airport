import { IContext } from '@airport/direction-indicator'
import { IEntitySelectProperties, RawEntityQuery } from '@airport/tarmaq-query';
import { IEntityLookup } from './IEntityLookup'

/**
 * Entity 'find' (find many) API.
 */
export interface IEntityFind<Entity, EntityArray extends Array<Entity>, IESP extends IEntitySelectProperties>
	extends IEntityLookup {

	/**
	 * Returns a Promise for a list of fully interlinked entity graphs.
	 */
	graph(
		rawGraphQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		context?: IContext
	): Promise<EntityArray>;

	/**
	 * Returns a Promise for a list of non-interlinked entity trees.
	 */
	tree(
		rawTreeQuery: RawEntityQuery<IESP> | { (...args: any[]): RawEntityQuery<IESP> },
		context?: IContext
	): Promise<EntityArray>;

}
