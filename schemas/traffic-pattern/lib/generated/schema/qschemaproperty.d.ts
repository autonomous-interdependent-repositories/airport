import { IQBooleanField, IQNumberField, IQOneToManyRelation, IQStringField } from '@airport/air-control';
import { IVersionedSchemaObject, VersionedSchemaObjectEId, VersionedSchemaObjectEUpdateColumns, VersionedSchemaObjectEUpdateProperties, VersionedSchemaObjectESelect, QVersionedSchemaObjectQId, QVersionedSchemaObjectQRelation, QVersionedSchemaObject } from './qversionedschemaobject';
import { ISchemaEntity, SchemaEntityEOptionalId, SchemaEntityESelect, QSchemaEntityQRelation } from './qschemaentity';
import { ISchemaPropertyColumn, SchemaPropertyColumnESelect, QSchemaPropertyColumn } from './qschemapropertycolumn';
import { ISchemaRelation, SchemaRelationESelect, QSchemaRelation } from './qschemarelation';
export interface ISchemaProperty extends IVersionedSchemaObject {
    id?: number;
    index?: number;
    name?: string;
    isId?: boolean;
    entity?: ISchemaEntity;
    propertyColumns?: ISchemaPropertyColumn[];
    relation?: ISchemaRelation[];
}
/**
 * SELECT - All fields and relations (optional).
 */
export interface SchemaPropertyESelect extends VersionedSchemaObjectESelect, SchemaPropertyEOptionalId {
    index?: number | IQNumberField;
    name?: string | IQStringField;
    isId?: boolean | IQBooleanField;
    entity?: SchemaEntityESelect;
    propertyColumns?: SchemaPropertyColumnESelect;
    relation?: SchemaRelationESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface SchemaPropertyEId extends VersionedSchemaObjectEId {
    id: number | IQNumberField;
}
/**
 * Ids fields and relations only (optional).
 */
export interface SchemaPropertyEOptionalId {
    id?: number | IQNumberField;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface SchemaPropertyEUpdateProperties extends VersionedSchemaObjectEUpdateProperties {
    index?: number | IQNumberField;
    name?: string | IQStringField;
    isId?: boolean | IQBooleanField;
    entity?: SchemaEntityEOptionalId;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface SchemaPropertyEUpdateColumns extends VersionedSchemaObjectEUpdateColumns {
    DEPRECATED_SINCE_SCHEMA_VERSION_ID?: number | IQNumberField;
    REMOVED_IN_SCHEMA_VERSION_ID?: number | IQNumberField;
    SINCE_SCHEMA_VERSION_ID?: number | IQNumberField;
    PROPERTY_INDEX?: number | IQNumberField;
    NAME?: string | IQStringField;
    IS_ID?: boolean | IQBooleanField;
    SCHEMA_ENTITY_ID?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface SchemaPropertyECreateProperties extends Partial<SchemaPropertyEId>, SchemaPropertyEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface SchemaPropertyECreateColumns extends SchemaPropertyEId, SchemaPropertyEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QSchemaProperty extends QVersionedSchemaObject {
    id: IQNumberField;
    index: IQNumberField;
    name: IQStringField;
    isId: IQBooleanField;
    entity: QSchemaEntityQRelation;
    propertyColumns: IQOneToManyRelation<QSchemaPropertyColumn>;
    relation: IQOneToManyRelation<QSchemaRelation>;
}
export interface QSchemaPropertyQId extends QVersionedSchemaObjectQId {
    id: IQNumberField;
}
export interface QSchemaPropertyQRelation extends QVersionedSchemaObjectQRelation<QSchemaProperty>, QSchemaPropertyQId {
}
