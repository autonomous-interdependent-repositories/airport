import { IRepositoryLoader } from '.';
import { IRelationManager } from './impl/core/entity/RelationManager';
import { IAirportDatabase } from './lingo/AirportDatabase';
import { IDatabaseFacade, IQueryFacade } from './lingo/core/repository/DatabaseFacade';
import { IUpdateCacheManager } from './lingo/core/UpdateCacheManager';
import { ILookup } from './lingo/query/api/Lookup';
import { IEntityUtils } from './lingo/utils/EntityUtils';
import { IFieldUtils } from './lingo/utils/FieldUtils';
import { IQMetadataUtils } from './lingo/utils/QMetadataUtils';
import { IQueryUtils } from './lingo/utils/QueryUtils';
import { IApplicationUtils } from './lingo/utils/ApplicationUtils';
export declare const AIRPORT_DATABASE: import("@airport/direction-indicator").IDependencyInjectionToken<IAirportDatabase>;
export declare const APPLICATION_UTILS: import("@airport/direction-indicator").IDependencyInjectionToken<IApplicationUtils>;
export declare const DATABASE_FACADE: import("@airport/direction-indicator").IDependencyInjectionToken<IDatabaseFacade>;
export declare const ENTITY_UTILS: import("@airport/direction-indicator").IDependencyInjectionToken<IEntityUtils>;
export declare const FIELD_UTILS: import("@airport/direction-indicator").IDependencyInjectionToken<IFieldUtils>;
export declare const LOOKUP: import("@airport/direction-indicator").IDependencyInjectionToken<ILookup>;
export declare const Q_METADATA_UTILS: import("@airport/direction-indicator").IDependencyInjectionToken<IQMetadataUtils>;
export declare const QUERY_FACADE: import("@airport/direction-indicator").IDependencyInjectionToken<IQueryFacade>;
export declare const QUERY_UTILS: import("@airport/direction-indicator").IDependencyInjectionToken<IQueryUtils>;
export declare const RELATION_MANAGER: import("@airport/direction-indicator").IDependencyInjectionToken<IRelationManager>;
export declare const REPOSITORY_LOADER: import("@airport/direction-indicator").IDependencyInjectionToken<IRepositoryLoader>;
export declare const UPDATE_CACHE_MANAGER: import("@airport/direction-indicator").IDependencyInjectionToken<IUpdateCacheManager>;
//# sourceMappingURL=tokens.d.ts.map