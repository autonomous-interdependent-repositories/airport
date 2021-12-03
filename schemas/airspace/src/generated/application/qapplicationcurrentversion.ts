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
	ApplicationGraph,
	ApplicationEId,
	ApplicationEOptionalId,
	ApplicationEUpdateProperties,
	ApplicationESelect,
	QApplication,
	QApplicationQId,
	QApplicationQRelation,
} from './qapplication';
import {
	Application,
} from '../../ddl/application/Application';
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
	ApplicationCurrentVersion,
} from '../../ddl/application/ApplicationCurrentVersion';


declare function require(moduleName: string): any;


//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface ApplicationCurrentVersionESelect
    extends IEntitySelectProperties, ApplicationCurrentVersionEOptionalId {
	// Non-Id Properties

	// Id Relations - full property interfaces
	application?: ApplicationESelect;
	applicationVersion?: ApplicationVersionESelect;

  // Non-Id relations (including OneToMany's)

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface ApplicationCurrentVersionEId
    extends IEntityIdProperties {
	// Id Properties

	// Id Relations - Ids only
	application: ApplicationEId;
	applicationVersion: ApplicationVersionEId;

}

/**
 * Ids fields and relations only (optional).
 */
export interface ApplicationCurrentVersionEOptionalId {
	// Id Properties

	// Id Relations - Ids only
	application?: ApplicationEOptionalId;
	applicationVersion?: ApplicationVersionEOptionalId;

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface ApplicationCurrentVersionEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties

	// Non-Id Relations - ids only & no OneToMany's

}

/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface ApplicationCurrentVersionGraph
	extends ApplicationCurrentVersionEOptionalId, IEntityCascadeGraph {
// NOT USED: Cascading Relations
// NOT USED: ${relationsForCascadeGraph}
	// Non-Id Properties

	// Relations
	application?: ApplicationGraph;
	applicationVersion?: ApplicationVersionGraph;

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface ApplicationCurrentVersionEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface ApplicationCurrentVersionECreateProperties
extends Partial<ApplicationCurrentVersionEId>, ApplicationCurrentVersionEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface ApplicationCurrentVersionECreateColumns
extends ApplicationCurrentVersionEId, ApplicationCurrentVersionEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QApplicationCurrentVersion extends IQEntity<ApplicationCurrentVersion>
{
	// Id Fields

	// Id Relations
	application: QApplicationQRelation;
	applicationVersion: QApplicationVersionQRelation;

	// Non-Id Fields

	// Non-Id Relations

}


// Entity Id Interface
export interface QApplicationCurrentVersionQId
{
	
	// Id Fields

	// Id Relations
	application: QApplicationQId;
	applicationVersion: QApplicationVersionQId;


}

// Entity Relation Interface
export interface QApplicationCurrentVersionQRelation
	extends IQRelation<ApplicationCurrentVersion, QApplicationCurrentVersion>, QApplicationCurrentVersionQId {
}
