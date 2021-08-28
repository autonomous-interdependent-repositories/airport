import { ICascadeGraphVerifier, IDatabaseManager, IDeleteManager, IDependencyGraphResolver, IEntityGraphReconstructor, IHistoryManager, IInsertManager, IOperationManager, IQueryManager, IStructuralEntityValidator, IUpdateManager } from '@airport/terminal-map';
import { IRepositoryManager } from './core/repository/RepositoryManager';
import { IOfflineDeltaStore } from './data/OfflineDeltaStore';
import { IOnlineManager } from './net/OnlineManager';
export declare const CASCADE_GRAPH_VERIFIER: import("@airport/di").IDiToken<ICascadeGraphVerifier>;
export declare const DATABASE_MANAGER: import("@airport/di").IDiToken<IDatabaseManager>;
export declare const DELETE_MANAGER: import("@airport/di").IDiToken<IDeleteManager>;
export declare const DEPENDENCY_GRAPH_RESOLVER: import("@airport/di").IDiToken<IDependencyGraphResolver>;
export declare const ENTITY_GRAPH_RECONSTRUCTOR: import("@airport/di").IDiToken<IEntityGraphReconstructor>;
export declare const HISTORY_MANAGER: import("@airport/di").IDiToken<IHistoryManager>;
export declare const INSERT_MANAGER: import("@airport/di").IDiToken<IInsertManager>;
export declare const OFFLINE_DELTA_STORE: import("@airport/di").IDiToken<IOfflineDeltaStore>;
export declare const ONLINE_MANAGER: import("@airport/di").IDiToken<IOnlineManager>;
export declare const OPERATION_MANAGER: import("@airport/di").IDiToken<IOperationManager>;
export declare const QUERY_MANAGER: import("@airport/di").IDiToken<IQueryManager>;
export declare const REPOSITORY_MANAGER: import("@airport/di").IDiToken<IRepositoryManager>;
export declare const STRUCTURAL_ENTITY_VALIDATOR: import("@airport/di").IDiToken<IStructuralEntityValidator>;
export declare const UPDATE_MANAGER: import("@airport/di").IDiToken<IUpdateManager>;
//# sourceMappingURL=tokens.d.ts.map