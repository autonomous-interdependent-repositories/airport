import { IEntityIdProperties, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQNumberField, IQEntity, IQRelation } from '@airport/air-control';
export interface ITerminalRun {
    id?: number;
    createTimestamp?: number;
    randomNumber?: number;
}
/**
 * SELECT - All fields and relations (optional).
 */
export interface TerminalRunESelect extends IEntitySelectProperties, TerminalRunEOptionalId {
    createTimestamp?: number | IQNumberField;
    randomNumber?: number | IQNumberField;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface TerminalRunEId extends IEntityIdProperties {
    id: number | IQNumberField;
}
/**
 * Ids fields and relations only (optional).
 */
export interface TerminalRunEOptionalId {
    id?: number | IQNumberField;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface TerminalRunEUpdateProperties extends IEntityUpdateProperties {
    createTimestamp?: number | IQNumberField;
    randomNumber?: number | IQNumberField;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface TerminalRunEUpdateColumns extends IEntityUpdateColumns {
    CREATE_TIMESTAMP?: number | IQNumberField;
    RANDOM_NUMBER?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface TerminalRunECreateProperties extends Partial<TerminalRunEId>, TerminalRunEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface TerminalRunECreateColumns extends TerminalRunEId, TerminalRunEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QTerminalRun extends IQEntity {
    id: IQNumberField;
    createTimestamp: IQNumberField;
    randomNumber: IQNumberField;
}
export interface QTerminalRunQId {
    id: IQNumberField;
}
export interface QTerminalRunQRelation extends IQRelation<QTerminalRun>, QTerminalRunQId {
}