import { IContext } from '@airport/direction-indicator';
import { Observable } from 'rxjs';
import { IEntitySelectProperties } from '../../core/entity/Entity';
import { RawEntityQuery } from '../facade/EntityQuery';
import { IEntityLookup } from './EntityLookup';
/**
 * Entity 'searchOne' API.
 */
export interface IEntitySearchOne<Entity, IESP extends IEntitySelectProperties> extends IEntityLookup<IEntitySearchOne<Entity, IESP>, IEntitySearchOne<Entity, IESP>> {
    /**
     * Returns an Observable of a fully interlinked entity graph.
     */
    graph(rawGraphQuery: RawEntityQuery<IESP> | {
        (...args: any[]): RawEntityQuery<IESP>;
    }, ctx?: IContext): Observable<Entity>;
    /**
     * Returns an Observable of a non-interlinked entity ITreeEntity.
     */
    tree(rawTreeQuery: RawEntityQuery<IESP> | {
        (...args: any[]): RawEntityQuery<IESP>;
    }, ctx?: IContext): Observable<Entity>;
}
//# sourceMappingURL=EntitySearchOne.d.ts.map