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
	ApplicationVersionGraph,
	ApplicationVersionEId,
	ApplicationVersionEOptionalId,
	ApplicationVersionEUpdateProperties,
	ApplicationVersionESelect,
	QApplicationVersion,
	QApplicationVersionQId,
	QApplicationVersionQRelation,
	ApplicationVersion,
	ApplicationEntityGraph,
	ApplicationEntityEId,
	ApplicationEntityEOptionalId,
	ApplicationEntityEUpdateProperties,
	ApplicationEntityESelect,
	QApplicationEntity,
	QApplicationEntityQId,
	QApplicationEntityQRelation,
	ApplicationEntity,
	ApplicationColumnGraph,
	ApplicationColumnEId,
	ApplicationColumnEOptionalId,
	ApplicationColumnEUpdateProperties,
	ApplicationColumnESelect,
	QApplicationColumn,
	QApplicationColumnQId,
	QApplicationColumnQRelation,
	ApplicationColumn,
} from '@airport/traffic-pattern';
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
	ActorGraph,
	ActorEId,
	ActorEOptionalId,
	ActorEUpdateProperties,
	ActorESelect,
	QActor,
	QActorQId,
	QActorQRelation,
	Actor,
} from '@airport/holding-pattern';
import {
	RecordUpdateStage,
} from '../ddl/RecordUpdateStage';


declare function require(moduleName: string): any;


//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface RecordUpdateStageESelect
    extends IEntitySelectProperties, RecordUpdateStageEOptionalId {
	// Non-Id Properties
	actorRecordId?: number | IQNumberField;
	updatedValue?: any | IQUntypedField;

	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	applicationVersion?: ApplicationVersionESelect;
	entity?: ApplicationEntityESelect;
	repository?: RepositoryESelect;
	actor?: ActorESelect;
	column?: ApplicationColumnESelect;

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface RecordUpdateStageEId
    extends IEntityIdProperties {
	// Id Properties
	id: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * Ids fields and relations only (optional).
 */
export interface RecordUpdateStageEOptionalId {
	// Id Properties
	id?: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface RecordUpdateStageEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties
	actorRecordId?: number | IQNumberField;
	updatedValue?: any | IQUntypedField;

	// Non-Id Relations - ids only & no OneToMany's
	applicationVersion?: ApplicationVersionEOptionalId;
	entity?: ApplicationEntityEOptionalId;
	repository?: RepositoryEOptionalId;
	actor?: ActorEOptionalId;
	column?: ApplicationColumnEOptionalId;

}

/**
 * PERSIST CASCADE - non-id relations (optional).
 */
export interface RecordUpdateStageGraph
	extends RecordUpdateStageEOptionalId, IEntityCascadeGraph {
// NOT USED: Cascading Relations
// NOT USED: ${relationsForCascadeGraph}
	// Non-Id Properties
	actorRecordId?: number | IQNumberField;
	updatedValue?: any | IQUntypedField;

	// Relations
	applicationVersion?: ApplicationVersionGraph;
	entity?: ApplicationEntityGraph;
	repository?: RepositoryGraph;
	actor?: ActorGraph;
	column?: ApplicationColumnGraph;

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface RecordUpdateStageEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns
	ACTOR_RECORD_ID?: number | IQNumberField;
	UPDATED_VALUE?: any | IQUntypedField;
	SCHEMA_VERSION_ID?: number | IQNumberField;
	SCHEMA_ENTITY_ID?: number | IQNumberField;
	REPOSITORY_ID?: number | IQNumberField;
	ACTOR_ID?: number | IQNumberField;
	SCHEMA_COLUMN_ID?: number | IQNumberField;

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface RecordUpdateStageECreateProperties
extends Partial<RecordUpdateStageEId>, RecordUpdateStageEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface RecordUpdateStageECreateColumns
extends RecordUpdateStageEId, RecordUpdateStageEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QRecordUpdateStage extends IQEntity<RecordUpdateStage>
{
	// Id Fields
	id: IQNumberField;

	// Id Relations

	// Non-Id Fields
	actorRecordId: IQNumberField;
	updatedValue: IQUntypedField;

	// Non-Id Relations
	applicationVersion: QApplicationVersionQRelation;
	entity: QApplicationEntityQRelation;
	repository: QRepositoryQRelation;
	actor: QActorQRelation;
	column: QApplicationColumnQRelation;

}


// Entity Id Interface
export interface QRecordUpdateStageQId
{
	
	// Id Fields
	id: IQNumberField;

	// Id Relations


}

// Entity Relation Interface
export interface QRecordUpdateStageQRelation
	extends IQRelation<RecordUpdateStage, QRecordUpdateStage>, QRecordUpdateStageQId {
}
