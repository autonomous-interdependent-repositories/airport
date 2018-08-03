import { IEntityIdProperties, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQNumberField, IQOneToManyRelation, IQStringField, QEntity, QRelation } from '@airport/air-control';
import { IUser, UserEOptionalId, UserESelect, QUserQRelation } from '../user/quser';
import { ITerminalRepository, TerminalRepositoryESelect, QTerminalRepository } from './qterminalrepository';
import { IAgtSharingMessage, AgtSharingMessageESelect, QAgtSharingMessage } from '../synchronization/qagtsharingmessage';
export interface ITerminal {
    id?: number;
    password?: string;
    lastPollConnectionDatetime?: number;
    lastSseConnectionDatetime?: number;
    user?: IUser;
    terminalRepositories?: ITerminalRepository[];
    sharingMessages?: IAgtSharingMessage[];
}
/**
 * SELECT - All fields and relations (optional).
 */
export interface TerminalESelect extends IEntitySelectProperties, TerminalEOptionalId, TerminalEUpdateProperties {
    user?: UserESelect;
    terminalRepositories?: TerminalRepositoryESelect;
    sharingMessages?: AgtSharingMessageESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface TerminalEId extends IEntityIdProperties {
    id: number | IQNumberField;
}
/**
 * Ids fields and relations only (optional).
 */
export interface TerminalEOptionalId {
    id?: number | IQNumberField;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface TerminalEUpdateProperties extends IEntityUpdateProperties {
    password?: string | IQStringField;
    lastPollConnectionDatetime?: number | IQNumberField;
    lastSseConnectionDatetime?: number | IQNumberField;
    user?: UserEOptionalId;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface TerminalEUpdateColumns extends IEntityUpdateColumns {
    PASSWORD?: string | IQStringField;
    LAST_RECENT_CONNECTION_DATETIME?: number | IQNumberField;
    LAST_ARCHIVE_CONNECTION_DATETIME?: number | IQNumberField;
    USER_ID?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface TerminalECreateProperties extends Partial<TerminalEId>, TerminalEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface TerminalECreateColumns extends TerminalEId, TerminalEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QTerminal extends QEntity {
    id: IQNumberField;
    password: IQStringField;
    lastPollConnectionDatetime: IQNumberField;
    lastSseConnectionDatetime: IQNumberField;
    user: QUserQRelation;
    terminalRepositories: IQOneToManyRelation<QTerminalRepository>;
    sharingMessages: IQOneToManyRelation<QAgtSharingMessage>;
}
export interface QTerminalQId {
    id: IQNumberField;
}
export interface QTerminalQRelation extends QRelation<QTerminal>, QTerminalQId {
}
