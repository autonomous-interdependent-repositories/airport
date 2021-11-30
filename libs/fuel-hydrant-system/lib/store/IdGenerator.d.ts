import { ISequenceGenerator } from '@airport/check-in';
import { IContext } from '@airport/di';
import { OperationHistoryId, RecordHistoryId, RepositoryTransactionHistory_Id, TransactionHistoryId } from '@airport/holding-pattern';
export declare type NumRepositoryTransHistories = number;
export declare type NumOperationTransHistories = number;
export declare type NumRecordHistories = number;
export interface TransactionHistoryIds {
    operationHistoryIds: OperationHistoryId[];
    recordHistoryIds: RecordHistoryId[];
    repositoryHistoryIds: RepositoryTransactionHistory_Id[];
    transactionHistoryId: TransactionHistoryId;
}
export interface IIdGenerator {
    init(): Promise<void>;
    generateTransactionHistoryIds(numRepositoryTransHistories: NumRepositoryTransHistories, numOperationTransHistories: NumOperationTransHistories, numRecordHistories: NumRecordHistories): Promise<TransactionHistoryIds>;
}
export interface IIdGeneratorContext extends IContext {
    di: {
        sequenceGenerator: ISequenceGenerator;
    };
    isServer: boolean;
}
/**
 * Created by Papa on 9/2/2016.
 */
export declare class IdGenerator implements IIdGenerator {
    private transactionHistoryIdColumns;
    init(): Promise<void>;
    populateTransactionHistoryIdColumns(): Promise<void>;
    doPopulateTransactionHistoryIdColumns(resolve: any): void;
    generateTransactionHistoryIds(numRepositoryTransHistories: NumRepositoryTransHistories, numOperationTransHistories: NumOperationTransHistories, numRecordHistories: NumRecordHistories): Promise<TransactionHistoryIds>;
    generateEntityIds(): Promise<void>;
    private getHoldingPatternDbEntity;
}
//# sourceMappingURL=IdGenerator.d.ts.map