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
	SharingNodeGraph,
	SharingNodeEId,
	SharingNodeEOptionalId,
	SharingNodeEUpdateProperties,
	SharingNodeESelect,
	QSharingNode,
	QSharingNodeQId,
	QSharingNodeQRelation,
} from './qsharingnode';
import {
	SharingNode,
} from '../../ddl/sharingNode/SharingNode';
import {
	RepositoryGraph,
	RepositoryEId,
	RepositoryEOptionalId,
	RepositoryEUpdateProperties,
	RepositoryESelect,
	QRepository,
	QRepositoryQId,
	QRepositoryQRelation,
	Repository,
} from '@airport/holding-pattern';
import {
	SharingNodeRepository,
} from '../../ddl/sharingNode/SharingNodeRepository';


declare function require(moduleName: string): any;


//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface SharingNodeRepositoryESelect
    extends IEntitySelectProperties, SharingNodeRepositoryEOptionalId {
	// Non-Id Properties
	agtRepositoryId?: number | IQNumberField;
	advisedSyncPriority?: string | IQStringField;
	repositorySyncStatus?: string | IQStringField;

	// Id Relations - full property interfaces
	sharingNode?: SharingNodeESelect;
	repository?: RepositoryESelect;

  // Non-Id relations (including OneToMany's)

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface SharingNodeRepositoryEId
    extends IEntityIdProperties {
	// Id Properties

	// Id Relations - Ids only
	sharingNode: SharingNodeEId;
	repository: RepositoryEId;

}

/**
 * Ids fields and relations only (optional).
 */
export interface SharingNodeRepositoryEOptionalId {
	// Id Properties

	// Id Relations - Ids only
	sharingNode?: SharingNodeEOptionalId;
	repository?: RepositoryEOptionalId;

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface SharingNodeRepositoryEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties
	agtRepositoryId?: number | IQNumberField;
	advisedSyncPriority?: string | IQStringField;
	repositorySyncStatus?: string | IQStringField;

	// Non-Id Relations - ids only & no OneToMany's

}

/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface SharingNodeRepositoryGraph
	extends SharingNodeRepositoryEOptionalId, IEntityCascadeGraph {
// NOT USED: Cascading Relations
// NOT USED: ${relationsForCascadeGraph}
	// Non-Id Properties
	agtRepositoryId?: number | IQNumberField;
	advisedSyncPriority?: string | IQStringField;
	repositorySyncStatus?: string | IQStringField;

	// Relations
	sharingNode?: SharingNodeGraph;
	repository?: RepositoryGraph;

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface SharingNodeRepositoryEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns
	AGT_REPOSITORY_ID?: number | IQNumberField;
	ADVISED_SYNC_PRIORITY?: string | IQStringField;
	REPOSITORY_SYNC_STATUS?: string | IQStringField;

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface SharingNodeRepositoryECreateProperties
extends Partial<SharingNodeRepositoryEId>, SharingNodeRepositoryEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface SharingNodeRepositoryECreateColumns
extends SharingNodeRepositoryEId, SharingNodeRepositoryEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QSharingNodeRepository extends IQEntity<SharingNodeRepository>
{
	// Id Fields

	// Id Relations
	sharingNode: QSharingNodeQRelation;
	repository: QRepositoryQRelation;

	// Non-Id Fields
	agtRepositoryId: IQNumberField;
	advisedSyncPriority: IQStringField;
	repositorySyncStatus: IQStringField;

	// Non-Id Relations

}


// Entity Id Interface
export interface QSharingNodeRepositoryQId
{
	
	// Id Fields

	// Id Relations
	sharingNode: QSharingNodeQId;
	repository: QRepositoryQId;


}

// Entity Relation Interface
export interface QSharingNodeRepositoryQRelation
	extends IQRelation<SharingNodeRepository, QSharingNodeRepository>, QSharingNodeRepositoryQId {
}
