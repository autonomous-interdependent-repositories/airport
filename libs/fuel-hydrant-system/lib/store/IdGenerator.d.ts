import { IAirportDatabase, IUtils } from '@airport/air-control';
import { ISequenceBlockDao } from '@airport/airport-code';
import { DbColumn, DbEntity } from '@airport/ground-control';
import { OperationHistoryId, RecordHistoryId, RepositoryTransactionHistoryId, TransactionHistoryId } from '@airport/holding-pattern';
import { IDomain } from '@airport/territory';
import { ISequenceConsumerDao } from '../../node_modules/@airport/airport-code/lib/dao/SequenceConsumerDao';
import { ISequenceDao } from '../../node_modules/@airport/airport-code/lib/dao/SequenceDao';
export declare type NumRepositoryTransHistories = number;
export declare type NumOperationTransHistories = number;
export declare type NumRecordHistories = number;
export interface TransactionHistoryIds {
    operationHistoryIds: OperationHistoryId[];
    recordHistoryIds: RecordHistoryId[];
    repositoryHistoryIds: RepositoryTransactionHistoryId[];
    transactionHistoryId: TransactionHistoryId;
}
export interface IIdGenerator {
    init(domain: IDomain): Promise<void>;
    generateTransactionHistoryIds(numRepositoryTransHistories: NumRepositoryTransHistories, numOperationTransHistories: NumOperationTransHistories, numRecordHistories: NumRecordHistories): TransactionHistoryIds;
    generateHoldingPatternEntityId(holdingPatternEntityName: string): number;
    generateEntityId(dbEntity: DbEntity, entity: any): number;
    loadLatestIds(): Promise<void>;
}
/**
 * Created by Papa on 9/2/2016.
 */
export declare class IdGenerator implements IIdGenerator {
    private airportDb;
    private sequenceBlockDao;
    private sequenceConsumerDao;
    private sequenceDao;
    private utils;
    private lastIds;
    private lastReservedIds;
    private sequences;
    private sequenceConsumer;
    private operationHistoryDbEntity;
    private recordHistoryDbEntity;
    private repoTransHistoryDbEntity;
    private transHistoryDbEntity;
    private operationHistoryIds;
    private recordHistoryIds;
    private repoTransHistoryIds;
    private transHistoryIds;
    private operationHistoryReservedIds;
    private recordHistoryReservedIds;
    private repoTransHistoryReservedIds;
    private transHistoryReservedIds;
    private operationHistorySeqBlock;
    private recordHistorySeqBlock;
    private repoTransHistorySeqBlock;
    private transHistorySeqBlock;
    constructor(airportDb: IAirportDatabase, sequenceBlockDao: ISequenceBlockDao, sequenceConsumerDao: ISequenceConsumerDao, sequenceDao: ISequenceDao, utils: IUtils);
    init(domain: IDomain): Promise<void>;
    private getHistorySeqBlock;
    private setHistoryIds;
    getHoldingPatternDbEntity(holdingPatternEntityName: string): DbEntity;
    generateIds(dbColumns: DbColumn[], numIds: number[]): number[][];
    generateTransactionHistoryIds(numRepositoryTransHistories: NumRepositoryTransHistories, numOperationTransHistories: NumOperationTransHistories, numRecordHistories: NumRecordHistories): TransactionHistoryIds;
    generateTransHistoryId(): number;
    generateRepoTransHistoryId(): number;
    generateOperationHistoryId(): number;
    generateRecordHistoryId(): number;
    generateHoldingPatternEntityId(holdingPatternEntityName: string): number;
    generateEntityId(dbEntity: DbEntity, entity?: any): number;
    /**
     * Ids are tracked on per-Entity basis.  Id's are assigned optimistically can be
     * retroactively updated if sync conflicts arise.  At load time latest ids
     * are loaded into memory and then are maintained in memory for the uptime of the
     * db server.
     * @returns {Promise<void>}
     */
    loadLatestIds(): Promise<void>;
    private generateByHoldingPatternEntityName;
    private getMaxIdQueries;
}