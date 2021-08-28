import { DbProperty } from '@airport/ground-control';
import { IEntityGraphReconstructor, IOperationContext } from '@airport/terminal-map';
/**
 * Takes a serialized object tree and reconstructs a (potentially)
 * interlinked object graph.
 */
export declare class EntityGraphReconstructor implements IEntityGraphReconstructor {
    restoreEntityGraph<T>(root: T[], context: IOperationContext): T[];
    protected linkEntityGraph<T>(currentEntities: T[], entitiesByOperationIndex: any[], context: IOperationContext): T[];
    protected assertRelationValueIsAnObject(relationValue: any, dbProperty: DbProperty): void;
    protected assertManyToOneNotArray(relationValue: any, dbProperty: DbProperty): void;
    protected assertOneToManyIsArray(relationValue: any, dbProperty: DbProperty): void;
}
//# sourceMappingURL=EntityGraphReconstructor.d.ts.map