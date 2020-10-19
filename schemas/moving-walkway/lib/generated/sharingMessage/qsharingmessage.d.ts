import { IEntityIdProperties, IEntityCascadeGraph, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQDateField, IQNumberField, IQOneToManyRelation, IQEntity, IQRelation } from '@airport/air-control';
import { SharingNodeGraph, SharingNodeEId, SharingNodeEOptionalId, SharingNodeESelect, QSharingNodeQId, QSharingNodeQRelation } from '../sharingnode/qsharingnode';
import { SharingMessageRepoTransBlockGraph, SharingMessageRepoTransBlockESelect, QSharingMessageRepoTransBlock } from './qsharingmessagerepotransblock';
/**
 * SELECT - All fields and relations (optional).
 */
export interface SharingMessageESelect extends IEntitySelectProperties, SharingMessageEOptionalId {
    origin?: number | IQNumberField;
    agtSharingMessageId?: number | IQNumberField;
    syncTimestamp?: Date | IQDateField;
    sharingNode?: SharingNodeESelect;
    sharingMessageRepoTransBlocks?: SharingMessageRepoTransBlockESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface SharingMessageEId extends IEntityIdProperties {
    id: number | IQNumberField;
    sharingNode: SharingNodeEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface SharingMessageEOptionalId {
    id?: number | IQNumberField;
    sharingNode?: SharingNodeEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface SharingMessageEUpdateProperties extends IEntityUpdateProperties {
    origin?: number | IQNumberField;
    agtSharingMessageId?: number | IQNumberField;
    syncTimestamp?: Date | IQDateField;
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface SharingMessageGraph extends SharingMessageEOptionalId, IEntityCascadeGraph {
    origin?: number | IQNumberField;
    agtSharingMessageId?: number | IQNumberField;
    syncTimestamp?: Date | IQDateField;
    sharingNode?: SharingNodeGraph;
    sharingMessageRepoTransBlocks?: SharingMessageRepoTransBlockGraph[];
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface SharingMessageEUpdateColumns extends IEntityUpdateColumns {
    ORIGIN?: number | IQNumberField;
    AGT_SHARING_MESSAGE_ID?: number | IQNumberField;
    SYNC_TIMESTAMP?: Date | IQDateField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface SharingMessageECreateProperties extends Partial<SharingMessageEId>, SharingMessageEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface SharingMessageECreateColumns extends SharingMessageEId, SharingMessageEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QSharingMessage extends IQEntity {
    id: IQNumberField;
    sharingNode: QSharingNodeQRelation;
    origin: IQNumberField;
    agtSharingMessageId: IQNumberField;
    syncTimestamp: IQDateField;
    sharingMessageRepoTransBlocks: IQOneToManyRelation<QSharingMessageRepoTransBlock>;
}
export interface QSharingMessageQId {
    id: IQNumberField;
    sharingNode: QSharingNodeQId;
}
export interface QSharingMessageQRelation extends IQRelation<QSharingMessage>, QSharingMessageQId {
}
//# sourceMappingURL=qsharingmessage.d.ts.map