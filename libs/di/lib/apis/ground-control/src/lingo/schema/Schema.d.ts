import { DbEntity, JsonSchemaEntity } from './Entity';
import { SchemaReferenceByIndex } from './Property';
import { SchemaStatus } from './SchemaStatus';
export declare type ApplicationId = number;
export declare type ApplicationName = string;
export declare type ApplicationPackageId = number;
export declare type DatabaseIndex = number;
export declare type DomainId = number;
export declare type DomainName = string;
export declare type JsonSchemaName = string;
export declare type PackageId = number;
export declare type PackageName = string;
export declare type SchemaIndex = number;
export declare type SchemaName = string;
export declare type SchemaReferenceIndex = number;
export declare type SchemaScope = 'private' | 'public' | null;
export declare type SchemaVersionId = number;
export declare type SchemaVersionInteger = number;
export declare type SchemaVersionMajor = number;
export declare type SchemaVersionMinor = number;
export declare type SchemaVersionPatch = number;
export declare type SchemaVersionString = string;
export interface DbPackage {
    id: PackageId;
    name: PackageName;
    applicationPackages: DbApplicationPackage[];
}
export interface DbApplicationPackage {
    application: DbApplication;
    id: ApplicationPackageId;
    package: DbPackage;
}
export interface DbApplication {
    applicationPackages: DbApplicationPackage[];
    domain: DbDomain;
    id: ApplicationId;
    name: ApplicationName;
}
export interface DbDomain {
    applications: DbApplication[];
    id: DomainId;
    name: DomainName;
    /**
     * Schemas by index
     */
    schemas: DbSchema[];
}
/**
 * A schema.
 */
export interface JsonSchema extends SchemaReferenceByIndex<SchemaIndex>, JsonDatabaseObject {
    /**
     * Domain of the schema ('public' if published).
     */
    domain: DomainName;
    /**
     * Name of the schema (npm package name).
     */
    name: JsonSchemaName;
    /**
     * Name of the npm package for this schema
     */
    packageName: PackageName;
    /**
     * Versions by integer version
     */
    versions: JsonSchemaVersion[];
}
/**
 * A schema with additional indexes (maps).
 */
export interface DbSchema extends SchemaReferenceByIndex<SchemaIndex>, DatabaseObject {
    currentVersion: DbSchemaVersion;
    /**
     * Domain of the schema ('public' if published).
     */
    domain: DbDomain;
    name: SchemaName;
    packageName: PackageName;
    scope: SchemaScope;
    status: SchemaStatus;
    /**
     * Versions by integer version
     */
    versions: DbSchemaVersion[];
}
export interface JsonDatabaseObject {
    deprecatedSinceVersion?: SchemaVersionInteger;
    removedInVersion?: SchemaVersionInteger;
    sinceVersion: SchemaVersionInteger;
}
export interface JsonSchemaVersionReference {
    /**
     * Integer version of the schema
     */
    integerVersion: SchemaVersionInteger;
}
export interface JsonSchemaVersion extends JsonSchemaVersionReference {
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
export interface DatabaseObject {
    deprecatedSinceVersion?: DbSchemaVersion;
    removedInVersion?: DbSchemaVersion;
    sinceVersion: DbSchemaVersion;
}
export interface DbSchemaVersionReference {
    integerVersion: SchemaVersionInteger;
}
/**
 * A schema with additional indexes (maps).
 */
export interface DbSchemaVersion extends DbSchemaVersionReference {
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
     * Schemas referenced in this schema, by terminal index.
     *
     */
    references: DbSchemaReference[];
    /**
     * Schemas referencing in this schema, by terminal index.
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
    integerVersion: SchemaVersionInteger;
    versionString: SchemaVersionString;
    majorVersion: SchemaVersionMajor;
    minorVersion: SchemaVersionMinor;
    patchVersion: SchemaVersionPatch;
    schema: DbSchema;
}
export interface DbSchemaReference extends DatabaseObject {
    index: SchemaReferenceIndex;
    ownSchemaVersion: DbSchemaVersion;
    referencedSchemaVersion: DbSchemaVersion;
}
/**
 * A physical terminal on a given device.  A device can
 * have multiple databases.  For example when loading an old repository
 * that went though a number of incompatible schema upgrades, that
 * repository will have to be loaded in a different terminal and then
 * upgraded.
 *
 * The default terminal keeps track of all databases on a device.  Each
 * other terminal will have only itself as the entry this this table.
 *
 * Each terminal can have different set of schemas.
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
//# sourceMappingURL=Schema.d.ts.map