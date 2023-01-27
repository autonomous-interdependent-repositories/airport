import { IApplicationRelationDao } from '@airport/airspace/dist/app/bundle';
import { RepositorySynchronizationData, RepositorySynchronizationMessage } from "@airport/arrivals-n-departures";
import { UserAccount_PublicSigningKey } from '@airport/aviation-communication';
import {
	Inject,
	Injected
} from '@airport/direction-indicator';
import {
	Actor_LocalId,
	ApplicationColumn_Index,
	ApplicationRelation_LocalId,
	ApplicationVersion_LocalId,
	Application_LocalId,
	DbApplication,
	DbApplicationVersion,
	DbColumn,
	DbEntity,
	Dictionary,
	IActor,
	IDbApplicationUtils,
	IOperationHistory,
	IRecordHistory,
	IRecordHistoryNewValue,
	IRecordHistoryOldValue,
	IRepository,
	IRepositoryMember,
	IRepositoryMemberAcceptance,
	IRepositoryMemberInvitation,
	IRepositoryTransactionHistory,
	ITerminal,
	IUserAccount,
	RepositoryMember_PublicSigningKey,
	RepositoryTransactionType,
	Repository_LocalId,
	Terminal_GUID
} from "@airport/ground-control";
import {
	IActorDao,
	IRepositoryDao
} from "@airport/holding-pattern/dist/app/bundle";
import { IApplicationUtils } from '@airport/tarmaq-query';

export interface ISyncOutDataSerializer {

	serialize(
		repositoryTransactionHistories: IRepositoryTransactionHistory[]
	): Promise<{
		historiesToSend: IRepositoryTransactionHistory[],
		messages: RepositorySynchronizationMessage[]
	}>
}

export interface IWithId {
	_localId: number
}
export interface IWithRecordHistory
	extends IWithId {
	recordHistory: IRecordHistory
}
export interface IWithIndex {
	index: number
}

export interface InMessageLookupStructures {
	actorInMessageIndexesById: Map<Actor_LocalId, number>
	applicationVersionInMessageIndexesById: Map<ApplicationVersion_LocalId, number>
	applicationVersions: DbApplicationVersion[]
	lastInMessageActorIndex: number
	lastInMessageApplicationVersionIndex: number
	lastInMessageReferencedApplicationRelation: number
	lastInMessageReferencedApplicationRelationIndex: number
	lastInMessageReferencedApplicationVersionIndex: number
	lastInMessageRepositoryIndex: number
	messageRepository: IRepository
	referencedApplicationRelationIndexesById: Map<ApplicationRelation_LocalId, number>
	referencedApplicationVersionInMessageIndexesById: Map<ApplicationVersion_LocalId, number>
	referencedApplicationVersions: DbApplicationVersion[]
	repositoryInMessageIndexesById: Map<Repository_LocalId, number>
	applicationLookup: InMessageEntityLookup<Application_LocalId>
	repositoryMemberLookup: InMessageEntityLookup<RepositoryMember_PublicSigningKey>
	terminalLookup: InMessageEntityLookup<Terminal_GUID>
	userAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
}

export interface InMessageEntityLookup<Id> {
	inMessageIndexesById: Map<Id, number>
	lastInMessageIndex: number
}

export enum IndexedEntityType {
	APPLICATION,
	REPOSITORY_MEMBER,
	TERMINAL,
	USER_ACCOUNT
}

@Injected()
export class SyncOutDataSerializer
	implements ISyncOutDataSerializer {

	@Inject()
	actorDao: IActorDao

	@Inject()
	applicationUtils: IApplicationUtils

	@Inject()
	applicationRelationDao: IApplicationRelationDao

	@Inject()
	dbApplicationUtils: IDbApplicationUtils

	@Inject()
	dictionary: Dictionary

	@Inject()
	repositoryDao: IRepositoryDao

	WITH_ID: IWithId = {} as any
	WITH_RECORD_HISTORY: IWithRecordHistory = {} as any
	WITH_INDEX: IWithIndex = {} as any

	async serialize(
		repositoryTransactionHistories: IRepositoryTransactionHistory[]
	): Promise<{
		historiesToSend: IRepositoryTransactionHistory[],
		messages: RepositorySynchronizationMessage[]
	}> {
		let historiesToSend: IRepositoryTransactionHistory[] = []
		const messages: RepositorySynchronizationMessage[] = []
		for (let i = 0; i < repositoryTransactionHistories.length; i++) {
			const repositoryTransactionHistory = repositoryTransactionHistories[i]
			if (repositoryTransactionHistory.repositoryTransactionType !== RepositoryTransactionType.LOCAL) {
				continue
			}
			const message = await this.serializeMessage(repositoryTransactionHistory)

			historiesToSend.push(repositoryTransactionHistory)
			messages.push(message)
		}

		return {
			historiesToSend,
			messages,
		}
	}

	private getInMessageEntityLookup(): InMessageEntityLookup<any> {
		return {
			inMessageIndexesById: new Map(),
			lastInMessageIndex: -1
		}
	}

	private async serializeMessage(
		repositoryTransactionHistory: IRepositoryTransactionHistory
	): Promise<RepositorySynchronizationMessage> {
		const lookups: InMessageLookupStructures = {
			actorInMessageIndexesById: new Map(),
			applicationLookup: this.getInMessageEntityLookup(),
			referencedApplicationRelationIndexesById: new Map(),
			applicationVersionInMessageIndexesById: new Map(),
			applicationVersions: [],
			lastInMessageActorIndex: -1,
			lastInMessageReferencedApplicationRelationIndex: -1,
			lastInMessageApplicationVersionIndex: -1,
			lastInMessageReferencedApplicationRelation: -1,
			lastInMessageReferencedApplicationVersionIndex: -1,
			lastInMessageRepositoryIndex: -1,
			messageRepository: repositoryTransactionHistory.repository,
			referencedApplicationVersionInMessageIndexesById: new Map(),
			referencedApplicationVersions: [],
			repositoryInMessageIndexesById: new Map(),
			repositoryMemberLookup: this.getInMessageEntityLookup(),
			terminalLookup: this.getInMessageEntityLookup(),
			userAccountLookup: this.getInMessageEntityLookup()
		}

		const data: RepositorySynchronizationData = {
			actors: [],
			applicationVersions: [],
			applications: [],
			history: null,
			// Repositories may reference records in other repositories
			referencedApplicationVersions: [],
			referencedApplicationRelations: [],
			referencedRepositories: [],
			repositoryMembers: [],
			userAccounts: [],
			terminals: []
		}

		const message: RepositorySynchronizationMessage = {
			data
		}

		data.history = this.serializeRepositoryTransactionHistory(
			repositoryTransactionHistory, message.data, lookups)

		// TODO: replace db lookups with TerminalState lookups where possible
		await this.serializeRepositories(repositoryTransactionHistory, data, lookups)
		await this.serializeActorsUserAccountsAndTerminals(
			data, lookups)
		await this.serializeApplicationsAndVersions(data,
			lookups.applicationLookup, lookups.applicationVersions, data.applicationVersions)
		await this.serializeReferencedApplicationProperties(data, lookups)
		await this.serializeApplicationsAndVersions(data, lookups.applicationLookup,
			lookups.referencedApplicationVersions, data.referencedApplicationVersions)

		return message
	}

	private async serializeActorsUserAccountsAndTerminals(
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): Promise<void> {
		let actorIdsToFindBy: Actor_LocalId[] = []
		for (let actorId of lookups.actorInMessageIndexesById.keys()) {
			actorIdsToFindBy.push(actorId)
		}
		const actors = await this.actorDao.findWithDetailsAndGlobalIdsByIds(actorIdsToFindBy)

		this.serializeUserAccounts(actors, data, lookups.userAccountLookup)
		this.serializeActorTerminals(actors, data,
			lookups.terminalLookup,
			lookups.userAccountLookup)

		for (const actor of actors) {
			const applicationInMessageIndex = this.serializeApplication(
				actor.application, lookups.applicationLookup, data)

			const actorInMessageIndex = lookups.actorInMessageIndexesById.get(actor._localId)
			data.actors[actorInMessageIndex] = {
				...this.WITH_ID,
				application: applicationInMessageIndex as any,
				terminal: lookups.terminalLookup.inMessageIndexesById.get(actor.terminal.GUID) as any,
				userAccount: lookups.userAccountLookup.inMessageIndexesById.get(actor.userAccount.accountPublicSigningKey) as any,
				GUID: actor.GUID
			}
		}
	}

	private serializeActorTerminals(
		actors: IActor[],
		data: RepositorySynchronizationData,
		inMessageTerminalLookup: InMessageEntityLookup<Terminal_GUID>,
		inMessageUserAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
	): void {
		for (const actor of actors) {
			this.addTerminalToMessage(
				actor.terminal,
				data,
				inMessageTerminalLookup,
				inMessageUserAccountLookup
			)
		}
	}

	private serializeUserAccounts(
		actors: IActor[],
		data: RepositorySynchronizationData,
		inMessageUserAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
	): void {
		for (const actor of actors) {
			this.addUserAccountToMessage(actor.userAccount, data, inMessageUserAccountLookup)
			this.addUserAccountToMessage(actor.terminal.owner, data, inMessageUserAccountLookup)
		}
	}

	private addRepositoryMemberToMessage(
		repositoryMember: IRepositoryMember,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures,
		addFullRecord: boolean
	): IRepositoryMember {
		const {
			entityAlreadyAdded,
			inMessageIndex
		} = this.getEntityInMessageIndex(repositoryMember,
			IndexedEntityType.REPOSITORY_MEMBER, lookups.repositoryMemberLookup)

		if (!entityAlreadyAdded) {
			let newRepositoryMember: IRepositoryMember = {
				...this.WITH_ID,
				memberPublicSigningKey: repositoryMember.memberPublicSigningKey
			}
			if (addFullRecord) {
				newRepositoryMember = {
					...newRepositoryMember,
					isOwner: repositoryMember.isOwner,
					isAdministrator: repositoryMember.isAdministrator,
					canWrite: repositoryMember.canWrite,
					status: repositoryMember.status,
					userAccount: this.addUserAccountToMessage(repositoryMember.userAccount,
						data, lookups.userAccountLookup)
				}
			}
			data.repositoryMembers[inMessageIndex] = newRepositoryMember
		}

		return inMessageIndex as any
	}

	private getEntityInMessageIndex(
		entity: DbApplication | IRepositoryMember | ITerminal | IUserAccount,
		indexedEntityType: IndexedEntityType,
		inMessageEntityLookup: InMessageEntityLookup<Application_LocalId
			| RepositoryMember_PublicSigningKey
			| Terminal_GUID
			| UserAccount_PublicSigningKey>
	): {
		entityAlreadyAdded: boolean,
		inMessageIndex: number
	} {
		let id
		switch (indexedEntityType) {
			case IndexedEntityType.APPLICATION:
				id = (entity as DbApplication).index
				break
			case IndexedEntityType.REPOSITORY_MEMBER:
				id = (entity as IRepositoryMember).memberPublicSigningKey
				break
			case IndexedEntityType.TERMINAL:
				id = (entity as ITerminal).GUID
				break
			case IndexedEntityType.USER_ACCOUNT:
				id = (entity as IUserAccount).accountPublicSigningKey
				break
		}

		let inMessageIndex = inMessageEntityLookup
			.inMessageIndexesById.get(id)

		const entityAlreadyAdded = inMessageIndex !== undefined
		if (inMessageIndex === undefined) {
			inMessageIndex = ++inMessageEntityLookup.lastInMessageIndex
			inMessageEntityLookup.inMessageIndexesById
				.set(id, inMessageIndex)
		}

		return {
			entityAlreadyAdded,
			inMessageIndex
		}
	}

	private addUserAccountToMessage(
		userAccount: IUserAccount,
		data: RepositorySynchronizationData,
		inMessageUserAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
	): IUserAccount {
		if (!userAccount) {
			return -1 as any
		}
		const {
			entityAlreadyAdded,
			inMessageIndex
		} = this.getEntityInMessageIndex(userAccount, IndexedEntityType.USER_ACCOUNT, inMessageUserAccountLookup)

		if (!entityAlreadyAdded) {
			let serializedUserAccount: IUserAccount = {
				...this.WITH_ID,
				accountPublicSigningKey: userAccount.accountPublicSigningKey,
				username: userAccount.username
			}
			data.userAccounts[inMessageIndex] = serializedUserAccount
		}

		return inMessageIndex as any
	}

	private addTerminalToMessage(
		terminal: ITerminal,
		data: RepositorySynchronizationData,
		inMessageTerminalLookup: InMessageEntityLookup<Terminal_GUID>,
		inMessageUserAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
	): ITerminal {
		const {
			entityAlreadyAdded,
			inMessageIndex
		} = this.getEntityInMessageIndex(terminal, IndexedEntityType.TERMINAL, inMessageTerminalLookup)

		if (!entityAlreadyAdded) {
			data.terminals[inMessageIndex] = {
				...this.WITH_ID,
				GUID: terminal.GUID,
				owner: inMessageUserAccountLookup.inMessageIndexesById.get(terminal.owner.accountPublicSigningKey) as any
			}
		}

		return inMessageIndex as any
	}

	private async serializeRepositories(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): Promise<void> {
		let repositoryIdsToFindBy: Repository_LocalId[] = []
		for (let repositoryId of lookups.repositoryInMessageIndexesById.keys()) {
			repositoryIdsToFindBy.push(repositoryId)
		}
		repositoryIdsToFindBy.push(repositoryTransactionHistory._localId)
		const repositories = await this.repositoryDao.findWithOwnerBy_LocalIds(repositoryIdsToFindBy)

		for (const repository of repositories) {
			let userAccountInMessageIndex = this.getEntityInMessageIndex(
				repository.owner, IndexedEntityType.USER_ACCOUNT, lookups.userAccountLookup)
			if (lookups.repositoryInMessageIndexesById.has(repository._localId)) {
				const repositoryInMessageIndex = lookups.repositoryInMessageIndexesById.get(repository._localId)
				data.referencedRepositories[repositoryInMessageIndex] =
					this.serializeRepository(repository, userAccountInMessageIndex as any)
			} else {
				if (typeof data.history.repository !== 'string') {
					data.history.repository.owner = userAccountInMessageIndex as any
					data.history.repository._localId = repository._localId
				}
			}
		}
	}

	private async serializeReferencedApplicationProperties(
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): Promise<void> {
		let applicationRelationIdsToFindBy: ApplicationRelation_LocalId[] = []
		for (let applicationRelationLocalId of lookups.referencedApplicationRelationIndexesById.keys()) {
			applicationRelationIdsToFindBy.push(applicationRelationLocalId)
		}

		const applicationRelations = await this.applicationRelationDao
			.findAllByLocalIdsWithApplications(applicationRelationIdsToFindBy)

		for (const applicationRelation of applicationRelations) {
			const referencedApplicationVersion = applicationRelation.entity.applicationVersion

			let referencedApplicationVersionInMessageIndex
			if (lookups.referencedApplicationVersionInMessageIndexesById.has(referencedApplicationVersion._localId)) {
				referencedApplicationVersionInMessageIndex = lookups.referencedApplicationVersionInMessageIndexesById.get(referencedApplicationVersion._localId)
			} else {
				referencedApplicationVersionInMessageIndex = ++lookups.lastInMessageReferencedApplicationVersionIndex
				lookups.referencedApplicationVersionInMessageIndexesById.set(referencedApplicationVersion._localId, referencedApplicationVersionInMessageIndex)
			}
			lookups.referencedApplicationVersions[referencedApplicationVersionInMessageIndex] = referencedApplicationVersion

			data.referencedApplicationRelations.push({
				...this.WITH_ID,
				index: applicationRelation.index,
				entity: {
					...this.WITH_ID,
					index: applicationRelation.entity.index,
					applicationVersion: referencedApplicationVersionInMessageIndex
				}
			})
		}
	}

	private serializeApplicationsAndVersions(
		data: RepositorySynchronizationData,
		applicationLookup: InMessageEntityLookup<Application_LocalId>,
		lookupVersions: DbApplicationVersion[],
		finalApplicationVersions: DbApplicationVersion[]
	): void {
		for (let i = 0; i < lookupVersions.length; i++) {
			const applicationVersion = lookupVersions[i]
			const applicationInMessageIndex = this.serializeApplication(
				applicationVersion.application, applicationLookup, data)

			finalApplicationVersions[i] = {
				...this.WITH_ID,
				application: applicationInMessageIndex as any,
				integerVersion: applicationVersion.integerVersion
			}
		}
	}

	private serializeApplication(
		application: DbApplication,
		applicationLookup: InMessageEntityLookup<Application_LocalId>,
		data: RepositorySynchronizationData
	): number {

		const {
			entityAlreadyAdded,
			inMessageIndex
		} = this.getEntityInMessageIndex(application, IndexedEntityType.APPLICATION, applicationLookup)

		if (!entityAlreadyAdded) {
			data.applications[inMessageIndex] = {
				...this.WITH_INDEX,
				domain: {
					...this.WITH_ID,
					name: application.domain.name
				},
				name: application.name
			}
		}

		return inMessageIndex
	}

	private serializeRepositoryTransactionHistory(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRepositoryTransactionHistory {
		repositoryTransactionHistory.operationHistory.sort((
			operationHistory1,
			operationHistory2,
		) => {
			if (operationHistory1.orderNumber < operationHistory2.orderNumber) {
				return -1;
			}
			if (operationHistory1.orderNumber > operationHistory2.orderNumber) {
				return 1;
			}
			return 0;
		})

		const serializedOperationHistory: IOperationHistory[] = []
		for (const operationHistory of repositoryTransactionHistory.operationHistory) {
			serializedOperationHistory.push(this.serializeOperationHistory(
				repositoryTransactionHistory, operationHistory, data, lookups))
		}

		const member = this.addRepositoryMemberToMessage(
			repositoryTransactionHistory,
			data,
			lookups,
			repositoryTransactionHistory.isRepositoryCreation
		)

		this.serializeNewRepositoryMembers(repositoryTransactionHistory, data, lookups)

		return {
			...this.WITH_ID,
			actor: this.getActorInMessageIndex(repositoryTransactionHistory.actor, lookups),
			GUID: repositoryTransactionHistory.GUID,
			isRepositoryCreation: repositoryTransactionHistory.isRepositoryCreation,
			isPublic: repositoryTransactionHistory.isPublic,
			member,
			repository: this.serializeHistoryRepository(
				repositoryTransactionHistory, data, lookups.userAccountLookup),
			operationHistory: serializedOperationHistory,
			saveTimestamp: repositoryTransactionHistory.saveTimestamp,
			newRepositoryMemberAcceptances: this.serializeRepositoryMemberAcceptances(
				repositoryTransactionHistory, data, lookups),
			newRepositoryMemberInvitations: this.serializeRepositoryMemberInvitations(
				repositoryTransactionHistory, data, lookups)
		}
	}

	private serializeHistoryRepository(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		inMessageUserAccountLookup: InMessageEntityLookup<UserAccount_PublicSigningKey>
	): IRepository {
		if (repositoryTransactionHistory.isRepositoryCreation) {
			const repository = repositoryTransactionHistory.repository
			let userAccountInMessageIndex = this.addUserAccountToMessage(
				repository.owner, data, inMessageUserAccountLookup)

			return this.serializeRepository(repository, userAccountInMessageIndex as any)
		} else {
			// When this repositoryTransactionHistory processed at sync-in 
			// the repository should already be loaded in the target database
			// if it's not then it's missing the repositoryTransactionHistory
			// with isRepositoryCreation === true
			return repositoryTransactionHistory.repository.GUID as any
		}
	}

	private serializeNewRepositoryMembers(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): void {
		for (const newRepositoryMember of repositoryTransactionHistory
			.newRepositoryMembers) {
			this.addRepositoryMemberToMessage(
				newRepositoryMember, data, lookups, true
			)
		}
	}

	private serializeRepositoryMemberAcceptances(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRepositoryMember[] {
		const serializedRepositoryMemberAcceptances: IRepositoryMemberAcceptance[] = []
		for (const newRepositoryMemberAcceptance of repositoryTransactionHistory
			.newRepositoryMemberAcceptances) {
			serializedRepositoryMemberAcceptances.push({
				...this.WITH_ID,
				createdAt: newRepositoryMemberAcceptance.createdAt,
				acceptingRepositoryMember: this.addRepositoryMemberToMessage(
					newRepositoryMemberAcceptance.acceptingRepositoryMember,
					data,
					lookups,
					false
				),
				invitationPublicSigningKey: newRepositoryMemberAcceptance.invitationPublicSigningKey
			})
		}

		return serializedRepositoryMemberAcceptances
	}

	private serializeRepositoryMemberInvitations(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRepositoryMember[] {
		const serializedRepositoryMemberInvitations: IRepositoryMemberInvitation[] = []
		for (const newRepositoryMemberInvitation of repositoryTransactionHistory
			.newRepositoryMemberInvitations) {
			serializedRepositoryMemberInvitations.push({
				...this.WITH_ID,
				createdAt: newRepositoryMemberInvitation.createdAt,
				invitationPublicSigningKey: newRepositoryMemberInvitation.invitationPublicSigningKey,
				invitedRepositoryMember: this.addRepositoryMemberToMessage(
					newRepositoryMemberInvitation.invitedRepositoryMember,
					data,
					lookups,
					true
				)
			})
		}

		return serializedRepositoryMemberInvitations
	}

	private serializeOperationHistory(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		operationHistory: IOperationHistory,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IOperationHistory {
		const dbEntity = operationHistory.entity
		const serializedRecordHistory: IRecordHistory[] = []
		for (const recordHistory of operationHistory.recordHistory) {
			serializedRecordHistory.push(this.serializeRecordHistory(
				repositoryTransactionHistory, recordHistory, dbEntity, data, lookups))
		}

		const entity = operationHistory.entity
		// Should be populated - coming from TerminalStore
		// if (typeof entity !== 'object') {
		// 	throw new Error(`OperationHistory.entity must be populated`)
		// }
		// if (typeof entity.index !== 'number') {
		// 	throw new Error(`OperationHistory.entity.index must be present`)
		// }
		const applicationVersion = entity.applicationVersion
		// Should be populated - coming from TerminalStore
		// if (typeof applicationVersion !== 'object') {
		// 	throw new Error(`OperationHistory.entity.applicationVersion must be populated`)
		// }
		// if (typeof applicationVersion._localId !== 'number') {
		// 	throw new Error(`OperationHistory.entity.applicationVersion._localId must be present`)
		// }

		let applicationVersionInMessageIndex
		if (lookups.applicationVersionInMessageIndexesById.has(applicationVersion._localId)) {
			applicationVersionInMessageIndex = lookups.applicationVersionInMessageIndexesById.get(applicationVersion._localId)
		} else {
			applicationVersionInMessageIndex = ++lookups.lastInMessageApplicationVersionIndex
			lookups.applicationVersionInMessageIndexesById.set(applicationVersion._localId, applicationVersionInMessageIndex)
		}
		lookups.applicationVersions[applicationVersionInMessageIndex] = applicationVersion

		return {
			...this.WITH_ID,
			changeType: operationHistory.changeType,
			entity: {
				...this.WITH_ID,
				applicationVersion: applicationVersionInMessageIndex,
				index: operationHistory.entity.index
			},
			recordHistory: serializedRecordHistory
		}
	}

	private serializeRecordHistory(
		repositoryTransactionHistory: IRepositoryTransactionHistory,
		recordHistory: IRecordHistory,
		dbEntity: DbEntity,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRecordHistory {
		const dbColumMapByIndex: Map<ApplicationColumn_Index, DbColumn> = new Map()
		for (const dbColumn of dbEntity.columns) {
			dbColumMapByIndex.set(dbColumn.index, dbColumn)
		}
		const newValues: IRecordHistoryNewValue[] = []
		for (const newValue of recordHistory.newValues) {
			const dbColumn = dbColumMapByIndex.get(newValue.columnIndex)
			newValues.push(this.serializeNewValue(
				newValue, dbColumn, data, lookups))
		}
		const oldValues: IRecordHistoryOldValue[] = []
		for (const oldValue of recordHistory.oldValues) {
			const dbColumn = dbColumMapByIndex.get(oldValue.columnIndex)
			oldValues.push(this.serializeOldValue(
				oldValue, dbColumn, data, lookups))
		}

		const actor = recordHistory.actor
		// Actor may be null if it's the same actor as for RepositoryTransactionHistory
		// if (typeof actor !== 'object') {
		// 	throw new Error(`RecordHistory.actor must be populated`)
		// }
		const baseObject: {
			_localId: number,
			actor?: IActor,
			newValues?: IRecordHistoryNewValue[],
			oldValues?: IRecordHistoryOldValue[]
		} = {
			...this.WITH_ID,
		}
		if (actor._localId !== repositoryTransactionHistory.actor._localId) {
			baseObject.actor = this.getActorInMessageIndex(actor, lookups)
		}
		if (newValues.length) {
			baseObject.newValues = newValues
		}
		if (oldValues.length) {
			baseObject.oldValues = oldValues
		}

		return {
			...baseObject,
			_actorRecordId: recordHistory._actorRecordId,
		}
	}

	private getActorInMessageIndex(
		actor: IActor,
		lookups: InMessageLookupStructures
	): IActor {
		if (!actor) {
			return null
		}
		return this.getActorInMessageIndexById(actor._localId, lookups) as any as IActor
	}

	private getActorInMessageIndexById(
		actorId: Actor_LocalId,
		lookups: InMessageLookupStructures
	): number {
		let actorInMessageIndex
		if (lookups.actorInMessageIndexesById.has(actorId)) {
			actorInMessageIndex = lookups.actorInMessageIndexesById.get(actorId)
		} else {
			actorInMessageIndex = ++lookups.lastInMessageActorIndex
			lookups.actorInMessageIndexesById.set(actorId, actorInMessageIndex)
		}

		return actorInMessageIndex
	}

	private serializeNewValue(
		newValue: IRecordHistoryNewValue,
		dbColumn: DbColumn,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRecordHistoryNewValue {
		return this.serializeValue(
			newValue, dbColumn, data, lookups, 'newValue')
	}

	private serializeOldValue(
		oldValue: IRecordHistoryOldValue,
		dbColumn: DbColumn,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures
	): IRecordHistoryOldValue {
		return this.serializeValue(
			oldValue, dbColumn, data, lookups, 'oldValue')
	}

	private serializeValue(
		valueRecord: IRecordHistoryNewValue | IRecordHistoryNewValue,
		dbColumn: DbColumn,
		data: RepositorySynchronizationData,
		lookups: InMessageLookupStructures,
		valueFieldName: 'newValue' | 'oldValue'
	): IRecordHistoryNewValue {
		let value = valueRecord[valueFieldName]
		let serailizedValue = value

		if (this.applicationUtils.isManyRelationColumn(dbColumn as DbColumn)) {
			const oneSideDbEntity = this.applicationUtils
				.getOneSideEntityOfManyRelationColumn(dbColumn as DbColumn)
			if (this.dictionary.isActor(oneSideDbEntity)) {
				serailizedValue = this.getActorInMessageIndexById(value, lookups)
			} else if (this.dictionary.isRepository(oneSideDbEntity)) {
				serailizedValue = this.getSerializedRepositoryId(value, lookups)
			} else if (this.dictionary.isTerminal(oneSideDbEntity)) {
				const terminalInMessageIndex = this.addTerminalToMessage(
					value, data, lookups.terminalLookup,
					lookups.userAccountLookup)
				serailizedValue = terminalInMessageIndex
			} else if (this.dictionary.isUserAccount(oneSideDbEntity)) {
				const userAccountInMessageIndex = this.addUserAccountToMessage(
					value, data, lookups.userAccountLookup)
				serailizedValue = userAccountInMessageIndex
			} else if (this.dictionary.isApplicationRelation(oneSideDbEntity)) {
				serailizedValue = this.getSerializedReferencedApplicationRelationId(
					value, lookups)
			}
		}

		if (this.dictionary.isActorRelationColumn(dbColumn)) {
			serailizedValue = this.getActorInMessageIndexById(value, lookups)
		}
		if (this.dictionary.isRepositoryRelationColumn(dbColumn)) {
			serailizedValue = this.getSerializedRepositoryId(value, lookups)
		}

		return {
			...this.WITH_RECORD_HISTORY,
			columnIndex: valueRecord.columnIndex,
			[valueFieldName]: serailizedValue
		}
	}

	private getSerializedRepositoryId(
		repositoryLocalId: number,
		lookups: InMessageLookupStructures
	) {
		if (repositoryLocalId === lookups.messageRepository._localId) {
			return -1
		}

		let serailizedValue = lookups.repositoryInMessageIndexesById.get(repositoryLocalId)
		if (serailizedValue === undefined) {
			lookups.lastInMessageRepositoryIndex++
			serailizedValue = lookups.lastInMessageRepositoryIndex
			lookups.repositoryInMessageIndexesById.set(repositoryLocalId, serailizedValue)
		}
		return serailizedValue
	}

	private getSerializedReferencedApplicationRelationId(
		applicationRelationLocalId: number,
		lookups: InMessageLookupStructures
	) {
		let serailizedValue = lookups.referencedApplicationRelationIndexesById
			.get(applicationRelationLocalId)
		if (serailizedValue === undefined) {
			lookups.lastInMessageReferencedApplicationRelationIndex++
			serailizedValue = lookups.lastInMessageReferencedApplicationRelationIndex
			lookups.referencedApplicationRelationIndexesById
				.set(applicationRelationLocalId, serailizedValue)
		}
		return serailizedValue
	}

	private serializeRepository(
		repository: IRepository,
		owner: IUserAccount
	): IRepository {
		return {
			...this.WITH_ID,
			ageSuitability: repository.ageSuitability,
			createdAt: repository.createdAt,
			immutable: repository.immutable,
			owner,
			source: repository.source,
			GUID: repository.GUID
		}
	}

}
