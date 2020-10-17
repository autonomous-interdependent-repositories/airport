import { IQDateField, IQEntity } from '@airport/air-control';
import { StageableECascadeGraph, StageableEId, StageableEUpdateColumns, StageableEUpdateProperties, StageableESelect, QStageableQId, QStageableQRelation, QStageable } from '../infrastructure/qstageable';
import { UserEOptionalId, UserESelect, QUserQRelation } from '@airport/travel-document-checkpoint';
/**
 * SELECT - All fields and relations (optional).
 */
export interface ImmutableRowESelect extends StageableESelect, ImmutableRowEOptionalId {
    createdAt?: Date | IQDateField;
    user?: UserESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface ImmutableRowEId extends StageableEId {
}
/**
 * Ids fields and relations only (optional).
 */
export interface ImmutableRowEOptionalId {
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface ImmutableRowEUpdateProperties extends StageableEUpdateProperties {
    createdAt?: Date | IQDateField;
    user?: UserEOptionalId;
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface ImmutableRowECascadeGraph extends StageableECascadeGraph {
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface ImmutableRowEUpdateColumns extends StageableEUpdateColumns {
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface ImmutableRowECreateProperties extends Partial<ImmutableRowEId>, ImmutableRowEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface ImmutableRowECreateColumns extends ImmutableRowEId, ImmutableRowEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QImmutableRow extends QStageable {
    createdAt: IQDateField;
    user: QUserQRelation;
}
export interface QImmutableRowQId extends QStageableQId {
}
export interface QImmutableRowQRelation<SubType extends IQEntity> extends QStageableQRelation<QImmutableRow>, QImmutableRowQId {
}
//# sourceMappingURL=qimmutablerow.d.ts.map