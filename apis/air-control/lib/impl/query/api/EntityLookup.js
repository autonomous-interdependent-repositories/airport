import { DI } from '@airport/di';
import { ENTITY_STATE_MANAGER } from '@airport/ground-control';
import { REPOSITORY_LOADER, SCHEMA_UTILS, UPDATE_CACHE_MANAGER } from '../../../tokens';
import { LookupProxy } from './Lookup';
export class EntityLookup extends LookupProxy {
    constructor(dbEntity, mapResults = EntityLookup.mapResults, repositorySource = null, repositoryUuid = null) {
        super();
        this.dbEntity = dbEntity;
        this.mapResults = mapResults;
        this.repositorySource = repositorySource;
        this.repositoryUuid = repositoryUuid;
    }
    setMap(MappedChildClass, isMapped = true) {
        return new MappedChildClass(this.dbEntity, isMapped);
    }
    setNoCache(ChildClass) {
        return new ChildClass(this.dbEntity, this.mapResults);
    }
    async entityLookup(rawEntityQuery, queryResultType, search, one, context) {
        context.dbEntity = this.dbEntity;
        if (this.repositorySource && this.repositoryUuid) {
            const repositoryLoader = await DI.db().get(REPOSITORY_LOADER);
            await repositoryLoader.loadRepository(this.repositorySource, this.repositoryUuid);
        }
        const result = await this.lookup(rawEntityQuery, queryResultType, search, one, null, context, this.mapResults);
        const [entityStateManager, schemaUtils, updateCacheManager] = await DI.db().get(ENTITY_STATE_MANAGER, SCHEMA_UTILS, UPDATE_CACHE_MANAGER);
        if (search) {
            throw new Error(`Search operations are not yet supported`);
        }
        else {
            updateCacheManager.saveOriginalValues(result, context.dbEntity, entityStateManager, schemaUtils);
        }
        return result;
    }
}
EntityLookup.mapResults = false;
//# sourceMappingURL=EntityLookup.js.map