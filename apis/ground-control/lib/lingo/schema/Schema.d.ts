import { DbEntity, JsonSchemaEntity } from "./Entity";
import { SchemaReferenceByIndex } from "./Property";
export declare type DatabaseIndex = number;
export declare type DomainId = number;
export declare type DomainName = string;
export declare type SchemaIndex = number;
export declare type SchemaName = string;
export declare type SchemaVersionId = number;
export declare type SchemaVersionMajor = number;
export declare type SchemaVersionMinor = number;
export declare type SchemaVersionPatch = number;
export declare type SchemaVersionString = string;
export interface DbDomain {
    id: DomainId;
    name: DomainName;
}
/**
 * A schema.
 */
export interface JsonSchema extends SchemaReferenceByIndex<SchemaIndex> {
    /**
     * Domain of the schema ('public' if published).
     */
    domain: string;
    /**
     * Name of the schema (npm package name).
     */
    name: SchemaName;
    versions: JsonSchemaVersion[];
}
/**
 * A schema with additional indexes (maps).
 */
export interface DbSchema extends SchemaReferenceByIndex<SchemaIndex> {
    currentVersion: DbSchemaVersion;
    /**
     * Domain of the schema ('public' if published).
     */
    domain: DbDomain;
    name: SchemaName;
    versions: DbSchemaVersion[];
}
export interface JsonSchemaVersion {
    /**
     * Semantic version of the schema.
     */
    versionString: SchemaVersionString;
    /**
     * Entities by their schema table indexes.
     */
    entities: JsonSchemaEntity[];
    /**
     * Schemas, referenced in this schema, by internal index.
     */
    referencedSchemas: JsonSchema[];
}
/**
 * A schema with additional indexes (maps).
 */
export interface DbSchemaVersion {
    id: SchemaVersionId;
    /**
     * Entities by their schema table indexes.
     */
    entities: DbEntity[];
    /**
     * Map of all entities by name.
     */
    entityMapByName?: {
        [entityName: string]: DbEntity;
    };
    /**
     * Schemas referenced in this schema, by database index.
     *
     */
    references: DbSchemaReference[];
    /**
     * Schemas referencing in this schema, by database index.
     *
     */
    referencedBy: DbSchemaReference[];
    /**
     * Map of all referenced schemas, by name.
     */
    referencesMapByName?: {
        [schemaName: string]: DbSchemaReference;
    };
    /**
     * Map of all referencing schemas, by name.
     */
    referencedByMapByName?: {
        [schemaName: string]: DbSchemaReference;
    };
    versionString: SchemaVersionString;
    majorVersion: SchemaVersionMajor;
    minorVersion: SchemaVersionMinor;
    patchVersion: SchemaVersionPatch;
    schema: DbSchema;
}
export interface DbSchemaReference {
    index: number;
    ownSchemaVersion: DbSchemaVersion;
    referencedSchemaVersion: DbSchemaVersion;
}
/**
 * A physical database on a given device.  A device can
 * have multiple databases.  For example when loading an old repository
 * that went though a number of incompatible schema upgrades, that
 * repository will have to be loaded in a different database and then
 * upgraded.
 *
 * The default database keeps track of all databases on a device.  Each
 * other database will have only itself as the entry this this table.
 *
 * Each database can have different set of schemas.
 *
 * @externs
 */
export interface DbDatabase {
    name: string;
    schemas: DbSchema[];
    schemaMapByName: {
        [name: string]: DbSchema;
    };
    storeType: number;
}
