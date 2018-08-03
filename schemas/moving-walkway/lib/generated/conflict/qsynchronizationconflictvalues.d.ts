import { IEntityIdProperties, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQNumberField, QEntity, QRelation } from '@airport/air-control';
import { ISynchronizationConflict, SynchronizationConflictEId, SynchronizationConflictEOptionalId, SynchronizationConflictESelect, QSynchronizationConflictQId, QSynchronizationConflictQRelation } from './qsynchronizationconflict';
export interface ISynchronizationConflictValues {
    columnIndex?: number;
    synchronizationConflict?: ISynchronizationConflict;
}
/**
 * SELECT - All fields and relations (optional).
 */
export interface SynchronizationConflictValuesESelect extends IEntitySelectProperties, SynchronizationConflictValuesEOptionalId, SynchronizationConflictValuesEUpdateProperties {
    synchronizationConflict?: SynchronizationConflictESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface SynchronizationConflictValuesEId extends IEntityIdProperties {
    columnIndex: number | IQNumberField;
    synchronizationConflict: SynchronizationConflictEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface SynchronizationConflictValuesEOptionalId {
    columnIndex?: number | IQNumberField;
    synchronizationConflict?: SynchronizationConflictEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface SynchronizationConflictValuesEUpdateProperties extends IEntityUpdateProperties {
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface SynchronizationConflictValuesEUpdateColumns extends IEntityUpdateColumns {
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface SynchronizationConflictValuesECreateProperties extends Partial<SynchronizationConflictValuesEId>, SynchronizationConflictValuesEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface SynchronizationConflictValuesECreateColumns extends SynchronizationConflictValuesEId, SynchronizationConflictValuesEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QSynchronizationConflictValues extends QEntity {
    columnIndex: IQNumberField;
    synchronizationConflict: QSynchronizationConflictQRelation;
}
export interface QSynchronizationConflictValuesQId {
    columnIndex: IQNumberField;
    synchronizationConflict: QSynchronizationConflictQId;
}
export interface QSynchronizationConflictValuesQRelation extends QRelation<QSynchronizationConflictValues>, QSynchronizationConflictValuesQId {
}
