import {
	IQEntityInternal,
	IEntityIdProperties,
	IEntityCascadeGraph,
	IEntityUpdateColumns,
	IEntityUpdateProperties,
	IEntitySelectProperties,
	IEntityDatabaseFacade,
	IEntityFind,
	IEntityFindOne,
	IEntitySearch,
	IEntitySearchOne,
	IQBooleanField,
	IQDateField,
	IQNumberField,
	IQOneToManyRelation,
	IQStringField,
	IQUntypedField,
	IQEntity,
	IQRelation,
	RawDelete,
	RawUpdate,
} from '@airport/air-control';
import {
	JsonApplicationWithLastIds,
} from '@airport/security-check';
import {
	DomainGraph,
	DomainEId,
	DomainEOptionalId,
	DomainEUpdateProperties,
	DomainESelect,
	QDomain,
	QDomainQId,
	QDomainQRelation,
} from './qdomain';
import {
	Domain,
} from '../../ddl/application/Domain';
import {
	ApplicationVersionGraph,
	ApplicationVersionEId,
	ApplicationVersionEOptionalId,
	ApplicationVersionEUpdateProperties,
	ApplicationVersionESelect,
	QApplicationVersion,
	QApplicationVersionQId,
	QApplicationVersionQRelation,
} from './qapplicationversion';
import {
	ApplicationVersion,
} from '../../ddl/application/ApplicationVersion';
import {
	ApplicationCurrentVersionGraph,
	ApplicationCurrentVersionEId,
	ApplicationCurrentVersionEOptionalId,
	ApplicationCurrentVersionEUpdateProperties,
	ApplicationCurrentVersionESelect,
	QApplicationCurrentVersion,
	QApplicationCurrentVersionQId,
	QApplicationCurrentVersionQRelation,
} from './qapplicationcurrentversion';
import {
	ApplicationCurrentVersion,
} from '../../ddl/application/ApplicationCurrentVersion';
import {
	Application,
} from '../../ddl/application/Application';


declare function require(moduleName: string): any;


//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface ApplicationESelect
    extends IEntitySelectProperties, ApplicationEOptionalId {
	// Non-Id Properties
	scope?: string | IQStringField;
	name?: string | IQStringField;
	packageName?: string | IQStringField;
	status?: string | IQStringField;
	signature?: string | IQStringField;
	jsonApplication?: JsonApplicationWithLastIds | IQStringField;

	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	domain?: DomainESelect;
	versions?: ApplicationVersionESelect;
	currentVersion?: ApplicationCurrentVersionESelect;

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface ApplicationEId
    extends IEntityIdProperties {
	// Id Properties
	index: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * Ids fields and relations only (optional).
 */
export interface ApplicationEOptionalId {
	// Id Properties
	index?: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface ApplicationEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties
	scope?: string | IQStringField;
	name?: string | IQStringField;
	packageName?: string | IQStringField;
	status?: string | IQStringField;
	signature?: string | IQStringField;
	jsonApplication?: JsonApplicationWithLastIds | IQStringField;

	// Non-Id Relations - ids only & no OneToMany's
	domain?: DomainEOptionalId;

}

/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface ApplicationGraph
	extends ApplicationEOptionalId, IEntityCascadeGraph {
// NOT USED: Cascading Relations
// NOT USED: ${relationsForCascadeGraph}
	// Non-Id Properties
	scope?: string | IQStringField;
	name?: string | IQStringField;
	packageName?: string | IQStringField;
	status?: string | IQStringField;
	signature?: string | IQStringField;
	jsonApplication?: JsonApplicationWithLastIds | IQStringField;

	// Relations
	domain?: DomainGraph;
	versions?: ApplicationVersionGraph[];
	currentVersion?: ApplicationCurrentVersionGraph[];

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface ApplicationEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns
	SCOPE?: string | IQStringField;
	APPLICATION_NAME?: string | IQStringField;
	PACKAGE_NAME?: string | IQStringField;
	STATUS?: string | IQStringField;
	SIGNATURE?: string | IQStringField;
	JSON_APPLICATION?: string | IQStringField;
	DOMAIN_ID?: number | IQNumberField;

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface ApplicationECreateProperties
extends Partial<ApplicationEId>, ApplicationEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface ApplicationECreateColumns
extends ApplicationEId, ApplicationEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QApplication extends IQEntity<Application>
{
	// Id Fields
	index: IQNumberField;

	// Id Relations

	// Non-Id Fields
	scope: IQStringField;
	name: IQStringField;
	packageName: IQStringField;
	status: IQStringField;
	signature: IQStringField;
	jsonApplication: IQStringField;

	// Non-Id Relations
	domain: QDomainQRelation;
	versions: IQOneToManyRelation<ApplicationVersion, QApplicationVersion>;
	currentVersion: IQOneToManyRelation<ApplicationCurrentVersion, QApplicationCurrentVersion>;

}


// Entity Id Interface
export interface QApplicationQId
{
	
	// Id Fields
	index: IQNumberField;

	// Id Relations


}

// Entity Relation Interface
export interface QApplicationQRelation
	extends IQRelation<Application, QApplication>, QApplicationQId {
}
