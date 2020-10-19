import { IEntityIdProperties, IEntityCascadeGraph, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQNumberField, IQEntity, IQRelation } from '@airport/air-control';
import { RepositoryGraph, RepositoryEId, RepositoryEOptionalId, RepositoryESelect, QRepositoryQId, QRepositoryQRelation } from '../repository/qrepository';
import { UserGraph, UserEId, UserEOptionalId, UserESelect, QUserQId, QUserQRelation } from './quser';
/**
 * SELECT - All fields and relations (optional).
 */
export interface UserRepositoryESelect extends IEntitySelectProperties, UserRepositoryEOptionalId {
    permission?: number | IQNumberField;
    repository?: RepositoryESelect;
    user?: UserESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface UserRepositoryEId extends IEntityIdProperties {
    repository: RepositoryEId;
    user: UserEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface UserRepositoryEOptionalId {
    repository?: RepositoryEOptionalId;
    user?: UserEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface UserRepositoryEUpdateProperties extends IEntityUpdateProperties {
    permission?: number | IQNumberField;
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface UserRepositoryGraph extends UserRepositoryEOptionalId, IEntityCascadeGraph {
    permission?: number | IQNumberField;
    repository?: RepositoryGraph;
    user?: UserGraph;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface UserRepositoryEUpdateColumns extends IEntityUpdateColumns {
    PERMISSION?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface UserRepositoryECreateProperties extends Partial<UserRepositoryEId>, UserRepositoryEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface UserRepositoryECreateColumns extends UserRepositoryEId, UserRepositoryEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QUserRepository extends IQEntity {
    repository: QRepositoryQRelation;
    user: QUserQRelation;
    permission: IQNumberField;
}
export interface QUserRepositoryQId {
    repository: QRepositoryQId;
    user: QUserQId;
}
export interface QUserRepositoryQRelation extends IQRelation<QUserRepository>, QUserRepositoryQId {
}
//# sourceMappingURL=quserrepository.d.ts.map