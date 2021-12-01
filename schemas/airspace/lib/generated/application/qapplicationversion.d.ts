import { IEntityIdProperties, IEntityCascadeGraph, IEntityUpdateColumns, IEntityUpdateProperties, IEntitySelectProperties, IQNumberField, IQOneToManyRelation, IQStringField, IQEntity, IQRelation } from '@airport/air-control';
import { ApplicationGraph, ApplicationEOptionalId, ApplicationESelect, QApplicationQRelation } from './qapplication';
import { ApplicationEntityGraph, ApplicationEntityESelect, QApplicationEntity } from './qapplicationentity';
import { ApplicationEntity } from '../../ddl/application/ApplicationEntity';
import { ApplicationReferenceGraph, ApplicationReferenceESelect, QApplicationReference } from './qapplicationreference';
import { ApplicationReference } from '../../ddl/application/ApplicationReference';
import { ApplicationVersion } from '../../ddl/application/ApplicationVersion';
/**
 * SELECT - All fields and relations (optional).
 */
export interface ApplicationVersionESelect extends IEntitySelectProperties, ApplicationVersionEOptionalId {
    integerVersion?: number | IQNumberField;
    versionString?: string | IQStringField;
    majorVersion?: number | IQNumberField;
    minorVersion?: number | IQNumberField;
    patchVersion?: number | IQNumberField;
    application?: ApplicationESelect;
    entities?: ApplicationEntityESelect;
    references?: ApplicationReferenceESelect;
    referencedBy?: ApplicationReferenceESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface ApplicationVersionEId extends IEntityIdProperties {
    id: number | IQNumberField;
}
/**
 * Ids fields and relations only (optional).
 */
export interface ApplicationVersionEOptionalId {
    id?: number | IQNumberField;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface ApplicationVersionEUpdateProperties extends IEntityUpdateProperties {
    integerVersion?: number | IQNumberField;
    versionString?: string | IQStringField;
    majorVersion?: number | IQNumberField;
    minorVersion?: number | IQNumberField;
    patchVersion?: number | IQNumberField;
    application?: ApplicationEOptionalId;
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface ApplicationVersionGraph extends ApplicationVersionEOptionalId, IEntityCascadeGraph {
    integerVersion?: number | IQNumberField;
    versionString?: string | IQStringField;
    majorVersion?: number | IQNumberField;
    minorVersion?: number | IQNumberField;
    patchVersion?: number | IQNumberField;
    application?: ApplicationGraph;
    entities?: ApplicationEntityGraph[];
    references?: ApplicationReferenceGraph[];
    referencedBy?: ApplicationReferenceGraph[];
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface ApplicationVersionEUpdateColumns extends IEntityUpdateColumns {
    INTEGER_VERSION?: number | IQNumberField;
    VERSION_STRING?: string | IQStringField;
    MAJOR_VERSION?: number | IQNumberField;
    MINOR_VERSION?: number | IQNumberField;
    PATCH_VERSION?: number | IQNumberField;
    APPLICATION_INDEX?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface ApplicationVersionECreateProperties extends Partial<ApplicationVersionEId>, ApplicationVersionEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface ApplicationVersionECreateColumns extends ApplicationVersionEId, ApplicationVersionEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QApplicationVersion extends IQEntity<ApplicationVersion> {
    id: IQNumberField;
    integerVersion: IQNumberField;
    versionString: IQStringField;
    majorVersion: IQNumberField;
    minorVersion: IQNumberField;
    patchVersion: IQNumberField;
    application: QApplicationQRelation;
    entities: IQOneToManyRelation<ApplicationEntity, QApplicationEntity>;
    references: IQOneToManyRelation<ApplicationReference, QApplicationReference>;
    referencedBy: IQOneToManyRelation<ApplicationReference, QApplicationReference>;
}
export interface QApplicationVersionQId {
    id: IQNumberField;
}
export interface QApplicationVersionQRelation extends IQRelation<ApplicationVersion, QApplicationVersion>, QApplicationVersionQId {
}
//# sourceMappingURL=qapplicationversion.d.ts.map