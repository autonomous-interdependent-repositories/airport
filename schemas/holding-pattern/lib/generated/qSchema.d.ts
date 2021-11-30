import { QSchema as AirportQSchema } from '@airport/air-control';
import { DbSchema, EntityId } from '@airport/ground-control';
import { QActor } from './infrastructure/qactor';
import { QOperationHistory } from './history/qoperationhistory';
import { QRecordHistory } from './history/qrecordhistory';
import { QRecordHistoryNewValue } from './history/qrecordhistorynewvalue';
import { QRecordHistoryOldValue } from './history/qrecordhistoryoldvalue';
import { QRepoTransHistoryChangedRepositoryActor } from './history/qrepotranshistorychangedrepositoryactor';
import { QRepository } from './repository/qrepository';
import { QRepositoryActor } from './repository/qrepositoryactor';
import { QRepositorySchema } from './repository/qrepositoryschema';
import { QRepositoryTransactionHistory } from './history/qrepositorytransactionhistory';
import { QTransactionHistory } from './history/qtransactionhistory';
export interface LocalQSchema extends AirportQSchema {
    db: DbSchema;
    Actor: QActor;
    OperationHistory: QOperationHistory;
    RecordHistory: QRecordHistory;
    RecordHistoryNewValue: QRecordHistoryNewValue;
    RecordHistoryOldValue: QRecordHistoryOldValue;
    RepoTransHistoryChangedRepositoryActor: QRepoTransHistoryChangedRepositoryActor;
    Repository: QRepository;
    RepositoryActor: QRepositoryActor;
    RepositorySchema: QRepositorySchema;
    RepositoryTransactionHistory: QRepositoryTransactionHistory;
    TransactionHistory: QTransactionHistory;
}
export declare const Q_SCHEMA: LocalQSchema;
export declare const Q: LocalQSchema;
export declare function diSet(dbEntityId: EntityId): boolean;
export declare function duoDiSet(dbEntityId: EntityId): boolean;
//# sourceMappingURL=qSchema.d.ts.map