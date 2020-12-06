import { DbEntity } from '@airport/ground-control';
export declare type OperationUniqueId = number;
export declare enum EntityState {
    CREATE = 1,
    DELETE = 2,
    PARENT_ID = 3,
    RESULT = 4,
    RESULT_DATE = 5,
    RESULT_JSON = 6,
    STUB = 7,
    UPDATE = 8
}
export interface EntityWithState {
    __state__: EntityState;
}
export interface IOperationUniqueIdSequence {
    sequence: OperationUniqueId;
}
export interface IEntityStateAsFlags {
    isCreate: boolean;
    isDelete: boolean;
    isParentId: boolean;
    isResult: boolean;
    isResultDate: boolean;
    isResultJson: boolean;
    isStub: boolean;
    isUpdate: boolean;
}
export interface IEntityStateManager {
    isStub<T>(entity: T): boolean;
    isParentId<T>(entity: T): boolean;
    getOperationUniqueIdSeq(): IOperationUniqueIdSequence;
    uniquelyIdentify<T>(entity: T, operationUniqueIdSeq: IOperationUniqueIdSequence): void;
    getOperationUniqueId<T>(entity: T, throwIfNotFound?: boolean): number;
    markAsStub<T>(entity: T): void;
    markForDeletion<T>(entity: T): void;
    markToCreate<T>(entity: T): void;
    markToUpdate<T>(entity: T): void;
    getEntityState<T>(entity: T): EntityState;
    copyEntityState<T>(fromEntity: T, toEntity: T): void;
    getUniqueIdFieldName(): string;
    getStateFieldName(): string;
    getEntityStateTypeAsFlags<T>(entity: T, dbEntity: DbEntity): IEntityStateAsFlags;
}
export declare class EntityStateManager implements IEntityStateManager {
    static OPERATION_UNIQUE_ID_FIELD: string;
    static STATE_FIELD: string;
    isStub<T>(entity: T): boolean;
    isParentId<T>(entity: T): boolean;
    getOperationUniqueIdSeq(): IOperationUniqueIdSequence;
    uniquelyIdentify<T>(entity: T, operationUniqueIdSeq: IOperationUniqueIdSequence): void;
    getOperationUniqueId<T>(entity: T, throwIfNotFound?: boolean): number;
    markAsStub<T>(entity: T): void;
    markForDeletion<T>(entity: T): void;
    markToCreate<T>(entity: T): void;
    markToUpdate<T>(entity: T): void;
    getEntityState<T>(entity: T): EntityState;
    copyEntityState<T>(fromEntity: T, toEntity: T): void;
    getUniqueIdFieldName(): string;
    getStateFieldName(): string;
    getEntityStateTypeAsFlags<T>(entity: T, dbEntity: DbEntity): IEntityStateAsFlags;
}
//# sourceMappingURL=EntityStateManager.d.ts.map