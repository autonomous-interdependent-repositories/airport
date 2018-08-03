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
	ISecurityAnswer,
	SecurityAnswerEId,
	SecurityAnswerEOptionalId,
	SecurityAnswerEUpdateProperties,
	SecurityAnswerESelect,
	QSecurityAnswer,
	QSecurityAnswerQId,
	QSecurityAnswerQRelation,
} from './security/qsecurityanswer';
import {
	IUserRepository,
	UserRepositoryEId,
	UserRepositoryEOptionalId,
	UserRepositoryEUpdateProperties,
	UserRepositoryESelect,
	QUserRepository,
	QUserRepositoryQId,
	QUserRepositoryQRelation,
} from './quserrepository';
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
	IAgtRepositoryTransactionBlock,
	AgtRepositoryTransactionBlockEId,
	AgtRepositoryTransactionBlockEOptionalId,
	AgtRepositoryTransactionBlockEUpdateProperties,
	AgtRepositoryTransactionBlockESelect,
	QAgtRepositoryTransactionBlock,
	QAgtRepositoryTransactionBlockQId,
	QAgtRepositoryTransactionBlockQRelation,
} from '../synchronization/qagtrepositorytransactionblock';


declare function require(moduleName: string): any;


//////////////////////////////
//     ENTITY INTERFACE     //
//////////////////////////////

export interface IUser {
	
	// Id Properties
	id?: number;

	// Id Relations

	// Non-Id Properties
	hash?: string;
	email?: string;
	isInvitation?: boolean;

	// Non-Id Relations
	securityAnswers?: ISecurityAnswer[];
	userRepositories?: IUserRepository[];
	terminals?: ITerminal[];
	repositoryTransactionBlocks?: IAgtRepositoryTransactionBlock[];

	// Transient Properties

	// Public Methods
	
}		
		
//////////////////////////////
//  API SPECIFIC INTERFACES //
//////////////////////////////

/**
 * SELECT - All fields and relations (optional).
 */
export interface UserESelect
    extends IEntitySelectProperties, UserEOptionalId, UserEUpdateProperties {
	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	securityAnswers?: SecurityAnswerESelect;
	userRepositories?: UserRepositoryESelect;
	terminals?: TerminalESelect;
	repositoryTransactionBlocks?: AgtRepositoryTransactionBlockESelect;

}

/**
 * DELETE - Ids fields and relations only (required).
 */
export interface UserEId
    extends IEntityIdProperties {
	// Id Properties
	id: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * Ids fields and relations only (optional).
 */
export interface UserEOptionalId {
	// Id Properties
	id?: number | IQNumberField;

	// Id Relations - Ids only

}

/**
 * UPDATE - non-id fields and relations (optional).
 */
export interface UserEUpdateProperties
	extends IEntityUpdateProperties {
	// Non-Id Properties
	hash?: string | IQStringField;
	email?: string | IQStringField;
	isInvitation?: boolean | IQBooleanField;

	// Non-Id Relations - ids only & no OneToMany's

}

/**
 * UPDATE - non-id columns (optional).
 */
export interface UserEUpdateColumns
	extends IEntityUpdateColumns {
	// Non-Id Columns
	HASH?: string | IQStringField;
	EMAIL?: string | IQStringField;
	IS_INVITATION?: boolean | IQBooleanField;

}

/**
 * CREATE - id fields and relations (required) and non-id fields and relations (optional).
 */
export interface UserECreateProperties
extends Partial<UserEId>, UserEUpdateProperties {
}

/**
 * CREATE - id columns (required) and non-id columns (optional).
 */
export interface UserECreateColumns
extends UserEId, UserEUpdateColumns {
}




///////////////////////////////////////////////
//  QUERY IMPLEMENTATION SPECIFIC INTERFACES //
///////////////////////////////////////////////

/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface QUser extends QEntity
{
	// Id Fields
	id: IQNumberField;

	// Id Relations

	// Non-Id Fields
	hash: IQStringField;
	email: IQStringField;
	isInvitation: IQBooleanField;

	// Non-Id Relations
	securityAnswers: IQOneToManyRelation<QSecurityAnswer>;
	userRepositories: IQOneToManyRelation<QUserRepository>;
	terminals: IQOneToManyRelation<QTerminal>;
	repositoryTransactionBlocks: IQOneToManyRelation<QAgtRepositoryTransactionBlock>;

}


// Entity Id Interface
export interface QUserQId
{
	
	// Id Fields
	id: IQNumberField;

	// Id Relations


}

// Entity Relation Interface
export interface QUserQRelation
	extends QRelation<QUser>, QUserQId {
}

