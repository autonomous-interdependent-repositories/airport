import { IEntityIdProperties, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQBooleanField, IQStringField, QEntity, QRelation } from '@airport/air-control';
import { IMonthlyArchiveLog, MonthlyArchiveLogEId, MonthlyArchiveLogEOptionalId, MonthlyArchiveLogESelect, QMonthlyArchiveLogQId, QMonthlyArchiveLogQRelation } from './qmonthlyarchivelog';
import { ITerminal, TerminalEId, TerminalEOptionalId, TerminalESelect, QTerminalQId, QTerminalQRelation } from '../terminal/qterminal';
export interface IMonthlyTerminalSyncLog {
    monthlyArchiveLog?: IMonthlyArchiveLog;
    terminal?: ITerminal;
    allAcknowledged?: boolean;
    dailySyncStatuses?: string;
}
/**
 * SELECT - All fields and relations (optional).
 */
export interface MonthlyTerminalSyncLogESelect extends IEntitySelectProperties, MonthlyTerminalSyncLogEOptionalId, MonthlyTerminalSyncLogEUpdateProperties {
    monthlyArchiveLog?: MonthlyArchiveLogESelect;
    terminal?: TerminalESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface MonthlyTerminalSyncLogEId extends IEntityIdProperties {
    monthlyArchiveLog: MonthlyArchiveLogEId;
    terminal: TerminalEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface MonthlyTerminalSyncLogEOptionalId {
    monthlyArchiveLog?: MonthlyArchiveLogEOptionalId;
    terminal?: TerminalEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface MonthlyTerminalSyncLogEUpdateProperties extends IEntityUpdateProperties {
    allAcknowledged?: boolean | IQBooleanField;
    dailySyncStatuses?: string | IQStringField;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface MonthlyTerminalSyncLogEUpdateColumns extends IEntityUpdateColumns {
    ALL_ACKNOWLEDGED?: boolean | IQBooleanField;
    DAILY_SYNC_STATUSES?: string | IQStringField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface MonthlyTerminalSyncLogECreateProperties extends Partial<MonthlyTerminalSyncLogEId>, MonthlyTerminalSyncLogEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface MonthlyTerminalSyncLogECreateColumns extends MonthlyTerminalSyncLogEId, MonthlyTerminalSyncLogEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QMonthlyTerminalSyncLog extends QEntity {
    monthlyArchiveLog: QMonthlyArchiveLogQRelation;
    terminal: QTerminalQRelation;
    allAcknowledged: IQBooleanField;
    dailySyncStatuses: IQStringField;
}
export interface QMonthlyTerminalSyncLogQId {
    monthlyArchiveLog: QMonthlyArchiveLogQId;
    terminal: QTerminalQId;
}
export interface QMonthlyTerminalSyncLogQRelation extends QRelation<QMonthlyTerminalSyncLog>, QMonthlyTerminalSyncLogQId {
}
