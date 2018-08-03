import {
	IQEntityInternal,
	IEntityIdProperties,
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
	QEntity,
	QRelation,
	RawDelete,
	RawUpdate,
} from '@airport/air-control';
import {
	ITerminal,
	TerminalEId,
	TerminalEOptionalId,
	TerminalEUpdateProperties,
	TerminalESelect,
	QTerminal,
	QTerminalQId,
	QTerminalQRelation,
} from '../terminal/qterminal';
import {
	ISyncLog,
	SyncLogEId,
	SyncLogEOptionalId,
	SyncLogEUpdateProperties,
	SyncLogESelect,
	QSyncLog,
	QSyncLogQId,
	QSyncLogQRelation,
} from './qsynclog';


declare function require(moduleName: string): any;


//////////////////////////////
//     ENTITY INTERFACE     //
//////////////////////////////

export interface IAgtSharingMessage {
	
	// Id Properties
	id?: number;

	// Id Relations

	// Non-Id Properties
	tmSharingMessageId?: number;
	acknowledged?: number;

	// Non-Id Relations
	terminal?: ITerminal;
	syncLogs?: ISyncLog[];

	// Transient Properties

	// Public Methods
	
}		
		
//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface AgtSharingMessageESelect
    extends IEntitySelectProperties, AgtSharingMessageEOptionalId, AgtSharingMessageEUpdateProperties {
	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	terminal?: TerminalESelect;
	syncLogs?: SyncLogESelect;

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface AgtSharingMessageEId
    extends IEntityIdProperties {
	// Id Properties
	id: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * Ids fields and relations only (optional).
 */
export interface AgtSharingMessageEOptionalId {
	// Id Properties
	id?: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface AgtSharingMessageEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties
	tmSharingMessageId?: number | IQNumberField;
	acknowledged?: number | IQNumberField;

	// Non-Id Relations - ids only & no OneToMany's
	terminal?: TerminalEOptionalId;

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface AgtSharingMessageEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns
	TM_SHARING_MESSAGE_ID?: number | IQNumberField;
	ACKNOWLEDGED?: number | IQNumberField;
	SYNCED_TERMINAL_ID?: number | IQNumberField;

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface AgtSharingMessageECreateProperties
extends Partial<AgtSharingMessageEId>, AgtSharingMessageEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface AgtSharingMessageECreateColumns
extends AgtSharingMessageEId, AgtSharingMessageEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QAgtSharingMessage extends QEntity
{
	// Id Fields
	id: IQNumberField;

	// Id Relations

	// Non-Id Fields
	tmSharingMessageId: IQNumberField;
	acknowledged: IQNumberField;

	// Non-Id Relations
	terminal: QTerminalQRelation;
	syncLogs: IQOneToManyRelation<QSyncLog>;

}


// Entity Id Interface
export interface QAgtSharingMessageQId
{
	
	// Id Fields
	id: IQNumberField;

	// Id Relations


}

// Entity Relation Interface
export interface QAgtSharingMessageQRelation
	extends QRelation<QAgtSharingMessage>, QAgtSharingMessageQId {
}

