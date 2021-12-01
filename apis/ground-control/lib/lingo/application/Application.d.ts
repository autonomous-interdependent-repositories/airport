import { DbEntity, JsonApplicationEntity } from './Entity';
import { ApplicationReferenceByIndex } from './Property';
import { ApplicationStatus } from './ApplicationStatus';
export declare type ApplicationId = number;
export declare type ApplicationName = string;
export declare type ApplicationSignature = string;
export declare type ApplicationPackageId = number;
export declare type DatabaseIndex = number;
export declare type DomainId = number;
export declare type DomainName = string;
export declare type JsonApplicationName = string;
export declare type PackageId = number;
export declare type PackageName = string;
export declare type ApplicationIndex = number;
export declare type ApplicationReferenceIndex = number;
export declare type ApplicationScope = 'private' | 'public' | null;
export declare type ApplicationVersionId = number;
export declare type ApplicationVersionInteger = number;
export declare type ApplicationVersionMajor = number;
export declare type ApplicationVersionMinor = number;
export declare type ApplicationVersionPatch = number;
export declare type ApplicationVersionString = string;
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
    signature: ApplicationSignature;
}
export interface DbDomain {
    id: DomainId;
    name: DomainName;
    applications: DbApplication[];
}
/**
 * A application.
 */
export interface JsonApplication extends ApplicationReferenceByIndex<ApplicationIndex>, JsonDatabaseObject {
    /**
     * Domain of the application ('public' if published).
     */
    domain: DomainName;
    /**
     * Name of the application (npm package name).
     */
    name: JsonApplicationName;
    /**
     * Name of the npm package for this application
     */
    packageName: PackageName;
    /**
     * Versions by integer version
     */
    versions: JsonApplicationVersion[];
}
/**
 * A application with additional indexes (maps).
 */
export interface DbApplication extends ApplicationReferenceByIndex<ApplicationIndex>, DatabaseObject {
    currentVersion: DbApplicationCurrentVersion[];
    /**
     * Domain of the application ('public' if published).
     */
    domain: DbDomain;
    name: ApplicationName;
    packageName: PackageName;
    scope: ApplicationScope;
    status: ApplicationStatus;
    /**
     * Versions by integer version
     */
    versions: DbApplicationVersion[];
}
export interface JsonDatabaseObject {
    deprecatedSinceVersion?: ApplicationVersionInteger;
    removedInVersion?: ApplicationVersionInteger;
    sinceVersion: ApplicationVersionInteger;
}
export interface JsonApplicationVersionReference {
    /**
     * Integer version of the application
     */
    integerVersion: ApplicationVersionInteger;
}
export interface JsonApplicationVersion extends JsonApplicationVersionReference {
    /**
     * Semantic version of the application.
     */
    versionString: ApplicationVersionString;
    /**
     * Entities by their application table indexes.
     */
    entities: JsonApplicationEntity[];
    /**
     * Applications, referenced in this application, by internal index.
     */
    referencedApplications: JsonApplication[];
}
export interface DatabaseObject {
    deprecatedSinceVersion?: DbApplicationVersion;
    removedInVersion?: DbApplicationVersion;
    sinceVersion: DbApplicationVersion;
}
export interface DbApplicationVersionReference {
    integerVersion: ApplicationVersionInteger;
}
/**
 * A application with additional indexes (maps).
 */
export interface DbApplicationCurrentVersion {
    application: DbApplication;
    applicationVersion: DbApplicationVersion;
}
/**
 * A application with additional indexes (maps).
 */
export interface DbApplicationVersion extends DbApplicationVersionReference {
    id: ApplicationVersionId;
    /**
     * Entities by their application table indexes.
     */
    entities: DbEntity[];
    /**
     * Map of all entities by name.
     */
    entityMapByName?: {
        [entityName: string]: DbEntity;
    };
    /**
     * Applications referenced in this application, by terminal index.
     *
     */
    references: DbApplicationReference[];
    /**
     * Applications referencing in this application, by terminal index.
     *
     */
    referencedBy: DbApplicationReference[];
    /**
     * Map of all referenced applications, by name.
     */
    referencesMapByName?: {
        [applicationName: string]: DbApplicationReference;
    };
    /**
     * Map of all referencing applications, by name.
     */
    referencedByMapByName?: {
        [applicationName: string]: DbApplicationReference;
    };
    integerVersion: ApplicationVersionInteger;
    versionString: ApplicationVersionString;
    majorVersion: ApplicationVersionMajor;
    minorVersion: ApplicationVersionMinor;
    patchVersion: ApplicationVersionPatch;
    application: DbApplication;
}
export interface DbApplicationReference extends DatabaseObject {
    index: ApplicationReferenceIndex;
    ownApplicationVersion: DbApplicationVersion;
    referencedApplicationVersion: DbApplicationVersion;
}
/**
 * A physical terminal on a given device.  A device can
 * have multiple databases.  For example when loading an old repository
 * that went though a number of incompatible application upgrades, that
 * repository will have to be loaded in a different terminal and then
 * upgraded.
 *
 * The default terminal keeps track of all databases on a device.  Each
 * other terminal will have only itself as the entry this this table.
 *
 * Each terminal can have different set of applications.
 *
 * @externs
 */
export interface DbDatabase {
    name: string;
    applications: DbApplication[];
    applicationMapByName: {
        [name: string]: DbApplication;
    };
    storeType: number;
}
//# sourceMappingURL=Application.d.ts.map