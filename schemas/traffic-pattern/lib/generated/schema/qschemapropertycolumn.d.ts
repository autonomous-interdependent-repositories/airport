import { IQNumberField } from '@airport/air-control';
import { VersionedSchemaObjectGraph, VersionedSchemaObjectEId, VersionedSchemaObjectEUpdateColumns, VersionedSchemaObjectEUpdateProperties, VersionedSchemaObjectESelect, QVersionedSchemaObjectQId, QVersionedSchemaObjectQRelation, QVersionedSchemaObject } from './qversionedschemaobject';
import { SchemaColumnGraph, SchemaColumnEId, SchemaColumnEOptionalId, SchemaColumnESelect, QSchemaColumnQId, QSchemaColumnQRelation } from './qschemacolumn';
import { SchemaPropertyGraph, SchemaPropertyEId, SchemaPropertyEOptionalId, SchemaPropertyESelect, QSchemaPropertyQId, QSchemaPropertyQRelation } from './qschemaproperty';
/**
 * SELECT - All fields and relations (optional).
 */
export interface SchemaPropertyColumnESelect extends VersionedSchemaObjectESelect, SchemaPropertyColumnEOptionalId {
    column?: SchemaColumnESelect;
    property?: SchemaPropertyESelect;
}
/**
 * DELETE - Ids fields and relations only (required).
 */
export interface SchemaPropertyColumnEId extends VersionedSchemaObjectEId {
    column: SchemaColumnEId;
    property: SchemaPropertyEId;
}
/**
 * Ids fields and relations only (optional).
 */
export interface SchemaPropertyColumnEOptionalId {
    column?: SchemaColumnEOptionalId;
    property?: SchemaPropertyEOptionalId;
}
/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface SchemaPropertyColumnEUpdateProperties extends VersionedSchemaObjectEUpdateProperties {
}
/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface SchemaPropertyColumnGraph extends SchemaPropertyColumnEOptionalId, VersionedSchemaObjectGraph {
    column?: SchemaColumnGraph;
    property?: SchemaPropertyGraph;
}
/**
 * UPDATE - non-id columns (optional).
 */
export interface SchemaPropertyColumnEUpdateColumns extends VersionedSchemaObjectEUpdateColumns {
    DEPRECATED_SINCE_SCHEMA_VERSION_ID?: number | IQNumberField;
    REMOVED_IN_SCHEMA_VERSION_ID?: number | IQNumberField;
    SINCE_SCHEMA_VERSION_ID?: number | IQNumberField;
}
/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface SchemaPropertyColumnECreateProperties extends Partial<SchemaPropertyColumnEId>, SchemaPropertyColumnEUpdateProperties {
}
/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface SchemaPropertyColumnECreateColumns extends SchemaPropertyColumnEId, SchemaPropertyColumnEUpdateColumns {
}
/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QSchemaPropertyColumn extends QVersionedSchemaObject {
    column: QSchemaColumnQRelation;
    property: QSchemaPropertyQRelation;
}
export interface QSchemaPropertyColumnQId extends QVersionedSchemaObjectQId {
    column: QSchemaColumnQId;
    property: QSchemaPropertyQId;
}
export interface QSchemaPropertyColumnQRelation extends QVersionedSchemaObjectQRelation<QSchemaPropertyColumn>, QSchemaPropertyColumnQId {
}
//# sourceMappingURL=qschemapropertycolumn.d.ts.map