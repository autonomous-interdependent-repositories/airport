import { DI } from '@airport/di';
import { ENTITY_STATE_MANAGER } from '@airport/ground-control';
import { UPDATE_CACHE_MANAGER } from '../../../tokens';
import { LookupProxy } from './Lookup';
export class EntityLookup extends LookupProxy {
    constructor(dbEntity, mapResults = EntityLookup.mapResults) {
        super();
        this.dbEntity = dbEntity;
        this.mapResults = mapResults;
    }
    setMap(MappedChildClass, isMapped = true) {
        return new MappedChildClass(this.dbEntity, isMapped);
    }
    setNoCache(ChildClass) {
        return new ChildClass(this.dbEntity, this.mapResults);
    }
    async entityLookup(rawEntityQuery, queryResultType, search, one, context) {
        context.dbEntity = this.dbEntity;
        const result = this.lookup(rawEntityQuery, queryResultType, search, one, null, context, this.mapResults);
        const [updateCacheManager, entityStateManager] = await DI.db().get(UPDATE_CACHE_MANAGER, ENTITY_STATE_MANAGER);
        if (search) {
            throw new Error(`Search operations are not yet supported`);
        }
        else {
            updateCacheManager.saveOriginalValues(result, context.dbEntity, entityStateManager);
        }
        return result;
    }
}
EntityLookup.mapResults = false;
//# sourceMappingURL=EntityLookup.js.map