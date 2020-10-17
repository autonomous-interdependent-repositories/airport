import { IQNumberField, IQEntity } from '@airport/air-control';
import { StageableECascadeGraph, StageableEId, StageableEUpdateColumns, StageableEUpdateProperties, StageableESelect, QStageableQId, QStageableQRelation, QStageable } from '../infrastructure/qstageable';
import { RepositoryEId, RepositoryEOptionalId, RepositoryESelect, QRepositoryQId, QRepositoryQRelation } from './qrepository';
import { ActorEId, ActorEOptionalId, ActorESelect, QActorQId, QActorQRelation } from '../infrastructure/qactor';
/**
 * SELECT - All fields and relations (optional).
 */
export interface RepositoryEntityESelect extends StageableESelect, RepositoryEntityEOptionalId {
    systemWideOperationId?: number | IQNumberField;
    repository?: RepositoryESelect;
    actor?: ActorESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface RepositoryEntityEId extends StageableEId {
    actorRecordId: number | IQNumberField;
    repository: RepositoryEId;
    actor: ActorEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface RepositoryEntityEOptionalId {
    actorRecordId?: number | IQNumberField;
    repository?: RepositoryEOptionalId;
    actor?: ActorEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface RepositoryEntityEUpdateProperties extends StageableEUpdateProperties {
    systemWideOperationId?: number | IQNumberField;
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface RepositoryEntityECascadeGraph extends StageableECascadeGraph {
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface RepositoryEntityEUpdateColumns extends StageableEUpdateColumns {
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface RepositoryEntityECreateProperties extends Partial<RepositoryEntityEId>, RepositoryEntityEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface RepositoryEntityECreateColumns extends RepositoryEntityEId, RepositoryEntityEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QRepositoryEntity extends QStageable {
    actorRecordId: IQNumberField;
    repository: QRepositoryQRelation;
    actor: QActorQRelation;
    systemWideOperationId: IQNumberField;
}
export interface QRepositoryEntityQId extends QStageableQId {
    actorRecordId: IQNumberField;
    repository: QRepositoryQId;
    actor: QActorQId;
}
export interface QRepositoryEntityQRelation<SubType extends IQEntity> extends QStageableQRelation<QRepositoryEntity>, QRepositoryEntityQId {
}
//# sourceMappingURL=qrepositoryentity.d.ts.map