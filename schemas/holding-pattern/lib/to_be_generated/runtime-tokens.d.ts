import { IRecordHistoryNewValueDao } from '../dao/history/RecordHistoryNewValueDao';
import { IRecordHistoryOldValueDao } from '../dao/history/RecordHistoryOldValueDao';
import { IRepositoryTransactionHistoryDao } from '../dao/history/RepositoryTransactionHistoryDao';
import { IActorDao } from '../dao/infrastructure/ActorDao';
import { IRepositoryDao } from '../dao/repository/RepositoryDao';
import { IOperationHistoryDuo } from '../duo/history/OperationHistoryDuo';
import { IRecordHistoryDuo } from '../duo/history/RecordHistoryDuo';
import { IRecordHistoryNewValueDuo } from '../duo/history/RecordHistoryNewValueDuo';
import { IRecordHistoryOldValueDuo } from '../duo/history/RecordHistoryOldValueDuo';
import { IRepositoryTransactionHistoryDuo } from '../duo/history/RepositoryTransactionHistoryDuo';
import { ITransactionHistoryDuo } from '../duo/history/TransactionHistoryDuo';
export declare const ACTOR_DAO: import("@airport/direction-indicator").IDependencyInjectionToken<IActorDao>;
export declare const OPERATION_HISTORY_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<IOperationHistoryDuo>;
export declare const RECORD_HISTORY_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<IRecordHistoryDuo>;
export declare const RECORD_HISTORY_NEW_VALUE_DAO: import("@airport/direction-indicator").IDependencyInjectionToken<IRecordHistoryNewValueDao>;
export declare const RECORD_HISTORY_NEW_VALUE_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<IRecordHistoryNewValueDuo>;
export declare const RECORD_HISTORY_OLD_VALUE_DAO: import("@airport/direction-indicator").IDependencyInjectionToken<IRecordHistoryOldValueDao>;
export declare const RECORD_HISTORY_OLD_VALUE_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<IRecordHistoryOldValueDuo>;
export declare const REPOSITORY_DAO: import("@airport/direction-indicator").IDependencyInjectionToken<IRepositoryDao>;
export declare const REPOSITORY_TRANSACTION_HISTORY_DAO: import("@airport/direction-indicator").IDependencyInjectionToken<IRepositoryTransactionHistoryDao>;
export declare const REPOSITORY_TRANSACTION_HISTORY_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<IRepositoryTransactionHistoryDuo>;
export declare const TRANSACTION_HISTORY_DUO: import("@airport/direction-indicator").IDependencyInjectionToken<ITransactionHistoryDuo>;
//# sourceMappingURL=runtime-tokens.d.ts.map