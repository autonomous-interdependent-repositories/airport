import { container, DI } from '@airport/di'
import {
	ChangeType,
	ensureChildJsMap,
	ensureChildJsSet,
	EntityId,
	ApplicationVersionId,
	TableIndex
} from '@airport/ground-control'
import {
	ActorId,
	IRecordHistory,
	RecordHistoryActorRecordId,
	REPO_TRANS_HISTORY_DAO,
	RepositoryEntity_ActorRecordId,
	Repository_Id
} from '@airport/holding-pattern'
import {
	IMissingRecord,
	IMissingRecordDao,
	IMissingRecordRepoTransBlockDao,
	IRepositoryTransactionBlock,
	IRepositoryTransactionBlockDao,
	MISSING_RECORD_DAO,
	MISSING_RECORD_REPO_TRANS_BLOCK_DAO,
	MissingRecordId,
	MissingRecordStatus,
	REPO_TRANS_BLOCK_DAO,
	SHARING_MESSAGE_DAO
} from '@airport/moving-walkway'
import { TERMINAL_STORE } from '@airport/terminal-map'
import {
	SYNC_IN_DATA_CHECKER,
	SYNC_IN_REPO_TRANS_BLOCK_CREATOR,
	SYNC_IN_UTILS
} from '../../../tokens'
import {
	IDataToTM,
	ISyncInUtils
} from '../SyncInUtils'

export interface DataCheckResults {
	dataMessagesWithCompatibleApplicationsAndData: IDataToTM[];
	dataMessagesWithIncompatibleData: IDataToTM[];
	existingRepoTransBlocksWithCompatibleApplicationsAndData: IRepositoryTransactionBlock[];
	missingRecordDataToTMs: IMissingRecordDataToTM[];
}

export interface IMissingRecordDataToTM {
	missingRecord: IMissingRecord,
	dataMessage: IDataToTM
}

export interface MissingRecordResults {
	compatibleDataMessageFlags: boolean[];
	missingRecordDataToTMs: IMissingRecordDataToTM[];
}

export interface DataStructuresForChanges {
	messageIndexMapByRecordToUpdateIds: Map<Repository_Id, Map<ApplicationVersionId,
		Map<EntityId, Map<ActorId, Map<RepositoryEntity_ActorRecordId, Set<number>>>>>>;
	recordsToUpdateMap: Map<Repository_Id, Map<ApplicationVersionId,
		Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>;
}

export interface ISyncInDataChecker {

	checkData(
		dataMessagesWithCompatibleApplications: IDataToTM[],
		// actorMapById: Map<ActorId, IActor>
	): Promise<DataCheckResults>

}

export class SyncInDataChecker
	implements ISyncInDataChecker {

	/**
	 * Every dataMessage.data.repoTransHistories array must be sorted before entering
	 * this method.
	 *
	 * @param {IDataToTM[]} dataMessagesWithCompatibleApplications
	 * @returns {DataCheckResults}
	 */
	async checkData(
		dataMessagesWithCompatibleApplications: IDataToTM[],
		// actorMapById: Map<ActorId, IActor>
	): Promise<DataCheckResults> {
		// TODO: remove unneeded dependencies once tested
		const [missingRecordDao, missingRecordRepoTransBlockDao,
			repositoryTransactionBlockDao, repositoryTransactionHistoryDao,
			sharingMessageDao, syncInRepositoryTransactionBlockCreator,
			syncInUtils, terminalStore] = await container(this).get(
				MISSING_RECORD_DAO, MISSING_RECORD_REPO_TRANS_BLOCK_DAO,
				REPO_TRANS_BLOCK_DAO, REPO_TRANS_HISTORY_DAO,
				SHARING_MESSAGE_DAO, SYNC_IN_REPO_TRANS_BLOCK_CREATOR,
				SYNC_IN_UTILS, TERMINAL_STORE)
		const {
			messageIndexMapByRecordToUpdateIds,
			recordsToUpdateMap
		} = this.getDataStructuresForChanges(
			dataMessagesWithCompatibleApplications, syncInUtils)

		const existingRecordIdMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>
			= await repositoryTransactionHistoryDao.findExistingRecordIdMap(
				recordsToUpdateMap)

		const dataMessagesWithIncompatibleData: IDataToTM[] = []
		const {
			compatibleDataMessageFlags,
			missingRecordDataToTMs,
		} = await this.determineMissingRecords(dataMessagesWithCompatibleApplications,
			dataMessagesWithIncompatibleData, recordsToUpdateMap,
			existingRecordIdMap, messageIndexMapByRecordToUpdateIds,
			missingRecordDao)

		const dataMessagesWithCompatibleApplicationsAndData: IDataToTM[] = []

		// filter out data messages with records that do not exist
		for (let i = 0; i < compatibleDataMessageFlags.length; i++) {
			const dataMessage = dataMessagesWithCompatibleApplications[i]
			if (compatibleDataMessageFlags[i]) {
				dataMessagesWithCompatibleApplicationsAndData.push(dataMessage)
			}
		}

		const toBeInsertedRecordMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>
			= this.getRecordsToInsertMap(dataMessagesWithCompatibleApplicationsAndData)

		const foundMissingRecordIds =
			await missingRecordDao.setStatusWhereIdsInAndReturnIds(
				toBeInsertedRecordMap, MissingRecordStatus.MISSING)

		// Find repository transaction blocks that now can be processed
		const existingRepoTransBlocksWithCompatibleApplicationsAndData
			= await this.getExistingRepoTransBlocksWithCompatibleApplicationsAndData(
				foundMissingRecordIds, missingRecordDao, missingRecordRepoTransBlockDao,
				repositoryTransactionBlockDao)

		return {
			dataMessagesWithCompatibleApplicationsAndData,
			dataMessagesWithIncompatibleData,
			existingRepoTransBlocksWithCompatibleApplicationsAndData,
			missingRecordDataToTMs
		}
	}

	private getDataStructuresForChanges(
		dataMessagesWithCompatibleApplications: IDataToTM[],
		syncInUtils: ISyncInUtils
	): DataStructuresForChanges {
		const recordsToInsertMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>
			= this.getRecordsToInsertMap(dataMessagesWithCompatibleApplications)

		const recordsToUpdateMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>
			= new Map()
		const messageIndexMapByRecordToUpdateIds: Map<Repository_Id, Map<ApplicationVersionId,
			Map<ActorId, Map<EntityId, Map<RepositoryEntity_ActorRecordId, Set<number>>>>>>
			= new Map()


		for (let i = 0; i < dataMessagesWithCompatibleApplications.length; i++) {
			const dataMessages = dataMessagesWithCompatibleApplications[i]
			dataMessages.data.repoTransHistories.sort((
				repoTransHistory1,
				repoTransHistory2,
			) => repoTransHistory1.saveTimestamp.getTime() - repoTransHistory2.saveTimestamp.getTime())
			for (const repoTransHistory of dataMessages.data.repoTransHistories) {
				const repositoryId = repoTransHistory.repository.id
				const recordToInsertMapForRepo = recordsToInsertMap.get(repositoryId)
				repoTransHistory.operationHistory.sort((
					operationHistory1,
					operationHistory2,
				) => operationHistory1.orderNumber - operationHistory2.orderNumber)
				for (const operationHistory of repoTransHistory.operationHistory) {
					let recordToInsertMapForEntityInRepo
					if (recordToInsertMapForRepo) {
						const recordToInsertMapForApplicationInRepo
							= recordToInsertMapForRepo.get(operationHistory.entity.applicationVersion.id)
						if (recordToInsertMapForApplicationInRepo) {
							recordToInsertMapForEntityInRepo
								= recordToInsertMapForApplicationInRepo.get(operationHistory.entity.id)
						}
					}

					switch (operationHistory.changeType) {
						case ChangeType.DELETE_ROWS:
						case ChangeType.UPDATE_ROWS:
							for (const recordHistory of operationHistory.recordHistory) {
								let recordToInsertSetForActor
								if (recordToInsertMapForEntityInRepo) {
									recordToInsertSetForActor
										= recordToInsertMapForEntityInRepo.get(recordHistory.actor.id)
								}
								if (!recordToInsertSetForActor
									|| !recordToInsertSetForActor.has(recordHistory.actorRecordId)) {
									const recordToUpdateMapForRepoInTable = syncInUtils
										.ensureRecordMapForRepoInTable(
											repositoryId, operationHistory, recordsToUpdateMap)
									this.ensureRecordId(recordHistory, recordToUpdateMapForRepoInTable,
										recordHistory.actorRecordId)
									ensureChildJsSet(
										ensureChildJsMap(
											ensureChildJsMap(
												ensureChildJsMap(
													ensureChildJsMap(
														messageIndexMapByRecordToUpdateIds, repositoryId),
													repoTransHistory.actor.id),
												operationHistory.entity.applicationVersion.id),
											operationHistory.entity.id),
										recordHistory.actorRecordId)
										.add(i)
								}
							}
							break
					}
				}
			}
		}

		return {
			messageIndexMapByRecordToUpdateIds,
			recordsToUpdateMap
		}
	}

	private async determineMissingRecords(
		dataMessagesWithCompatibleApplications: IDataToTM[],
		dataMessagesWithIncompatibleData: IDataToTM[],
		recordToUpdateMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>,
		existingRecordIdMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>,
		messageIndexMapByRecordToUpdateIds: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Map<RepositoryEntity_ActorRecordId, Set<number>>>>>>,
		missingRecordDao: IMissingRecordDao
	): Promise<MissingRecordResults> {
		const compatibleDataMessageFlags: boolean[]
			= dataMessagesWithCompatibleApplications.map(
				_ => true)
		const missingRecords: IMissingRecord[] = []
		const missingRecordDataToTMs: IMissingRecordDataToTM[] = []
		const sparseDataMessagesWithIncompatibleData: IDataToTM[] = []

		for (const [repositoryId, updatedRecordMapForRepository] of recordToUpdateMap) {
			const existingRecordMapForRepository: Map<ApplicationVersionId, Map<TableIndex,
				Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>
				= existingRecordIdMap.get(repositoryId)
			const messageIndexMapForRepository: Map<ApplicationVersionId, Map<TableIndex,
				Map<ActorId, Map<RepositoryEntity_ActorRecordId, Set<number>>>>>
				= messageIndexMapByRecordToUpdateIds.get(repositoryId)

			for (const [applicationIndex, updatedRecordMapForApplicationInRepo] of updatedRecordMapForRepository) {
				let existingRecordMapForApplicationInRepo: Map<EntityId,
					Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>
				if (existingRecordMapForRepository) {
					existingRecordMapForApplicationInRepo = existingRecordMapForRepository.get(applicationIndex)
				}
				const messageIndexMapForApplicationIndRepo: Map<EntityId, Map<ActorId,
					Map<RepositoryEntity_ActorRecordId, Set<number>>>>
					= messageIndexMapForRepository.get(applicationIndex)

				for (const [entityId, updatedRecordMapForTableInRepo] of updatedRecordMapForApplicationInRepo) {
					let existingRecordMapForTableInApplication: Map<ActorId, Set<RepositoryEntity_ActorRecordId>>
					if (existingRecordMapForApplicationInRepo) {
						existingRecordMapForTableInApplication = existingRecordMapForApplicationInRepo.get(entityId)
					}
					const messageIndexMapForTableInApplication: Map<ActorId,
						Map<RepositoryEntity_ActorRecordId, Set<number>>>
						= messageIndexMapForApplicationIndRepo.get(entityId)

					for (const [actorId, actorRecordIds] of updatedRecordMapForTableInRepo) {
						let existingRecordIdSetForActor: Set<RepositoryEntity_ActorRecordId>
						if (existingRecordMapForTableInApplication) {
							existingRecordIdSetForActor = existingRecordMapForTableInApplication.get(actorId)
						}
						const messageIndexMapForActor: Map<RepositoryEntity_ActorRecordId, Set<number>>
							= messageIndexMapForTableInApplication.get(actorId)
						if (existingRecordIdSetForActor) {
							for (const actorRecordId of actorRecordIds) {
								if (!existingRecordIdSetForActor.has(actorRecordId)) {
									this.recordMissingRecordAndRepoTransBlockRelations(
										repositoryId,
										applicationIndex,
										entityId,
										actorId,
										actorRecordId,
										missingRecords,
										compatibleDataMessageFlags,
										messageIndexMapForActor,
										dataMessagesWithCompatibleApplications,
										dataMessagesWithIncompatibleData,
										sparseDataMessagesWithIncompatibleData,
										missingRecordDataToTMs
									)
								}
							}
						} else {
							for (const actorRecordId of actorRecordIds) {
								this.recordMissingRecordAndRepoTransBlockRelations(
									repositoryId,
									applicationIndex,
									entityId,
									actorId,
									actorRecordId,
									missingRecords,
									compatibleDataMessageFlags,
									messageIndexMapForActor,
									dataMessagesWithCompatibleApplications,
									dataMessagesWithIncompatibleData,
									sparseDataMessagesWithIncompatibleData,
									missingRecordDataToTMs
								)
							}
						}
					}
				}
			}
		}

		if (missingRecords.length) {
			await missingRecordDao.bulkCreate(missingRecords, false)
		}

		return {
			compatibleDataMessageFlags,
			missingRecordDataToTMs
		}
	}

	private getRecordsToInsertMap(
		dataMessages: IDataToTM[]
	): Map<Repository_Id, Map<ApplicationVersionId,
		Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>> {
		const recordsToInsertMap: Map<Repository_Id, Map<ApplicationVersionId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntity_ActorRecordId>>>>>
			= new Map()

		for (let i = 0; i < dataMessages.length; i++) {
			const dataMessage = dataMessages[i]
			for (const repoTransHistory of dataMessage.data.repoTransHistories) {
				const repositoryId = repoTransHistory.repository.id
				for (const operationHistory of repoTransHistory.operationHistory) {
					switch (operationHistory.changeType) {
						case ChangeType.INSERT_VALUES:
							for (const recordHistory of operationHistory.recordHistory) {
								ensureChildJsSet(
									ensureChildJsMap(
										ensureChildJsMap(
											ensureChildJsMap(
												recordsToInsertMap, repositoryId),
											operationHistory.entity.applicationVersion.id),
										operationHistory.entity.id),
									recordHistory.actor.id)
									.add(recordHistory.actorRecordId)
							}
							break
					}
				}
			}
		}
		return recordsToInsertMap
	}

	ensureRecordId(
		recordHistory: IRecordHistory,
		actorRecordIdSetByActor: Map<ActorId, Set<RepositoryEntity_ActorRecordId>>,
		actorRecordId: RepositoryEntity_ActorRecordId = recordHistory.actorRecordId
	): void {
		ensureChildJsSet(
			actorRecordIdSetByActor, recordHistory.actor.id).add(actorRecordId)
	}

	private recordMissingRecordAndRepoTransBlockRelations(
		repositoryId: Repository_Id,
		applicationVersionId: ApplicationVersionId,
		entityId: TableIndex,
		actorId: ActorId,
		actorRecordId: RepositoryEntity_ActorRecordId,
		missingRecords: IMissingRecord[],
		compatibleDataMessageFlags: boolean[],
		messageIndexMapForActor: Map<RepositoryEntity_ActorRecordId, Set<number>>,
		dataMessagesWithCompatibleApplications: IDataToTM[],
		dataMessagesWithIncompatibleData: IDataToTM[],
		sparseDataMessagesWithIncompatibleData: IDataToTM[],
		missingRecordDataToTMs: IMissingRecordDataToTM[]
	): void {
		const missingRecord = this.createMissingRecord(repositoryId, applicationVersionId,
			entityId, actorId, actorRecordId)
		missingRecords.push(missingRecord)
		for (const messageIndex of messageIndexMapForActor.get(actorRecordId)) {
			let dataMessage: IDataToTM
			if (compatibleDataMessageFlags[messageIndex]) {
				const dataMessage = dataMessagesWithCompatibleApplications[messageIndex]
				sparseDataMessagesWithIncompatibleData[messageIndex]
					= dataMessage
				dataMessagesWithIncompatibleData.push(dataMessage)
				compatibleDataMessageFlags[messageIndex] = false
			} else {
				dataMessage
					= sparseDataMessagesWithIncompatibleData[messageIndex]
			}
			missingRecordDataToTMs.push({
				missingRecord,
				dataMessage
			})
		}
	}

	private createMissingRecord(
		repositoryId: Repository_Id,
		applicationVersionId: ApplicationVersionId,
		entityId: EntityId,
		actorId: ActorId,
		actorRecordId: RecordHistoryActorRecordId
	): IMissingRecord {
		return {
			applicationVersion: {
				id: applicationVersionId
			},
			entity: {
				id: entityId
			},
			repository: {
				id: repositoryId
			},
			actor: {
				id: actorId
			},
			actorRecordId,
			status: MissingRecordStatus.MISSING
		}
	}

	private async getExistingRepoTransBlocksWithCompatibleApplicationsAndData(
		foundMissingRecordIds: MissingRecordId[],
		missingRecordDao: IMissingRecordDao,
		missingRecordRepoTransBlockDao: IMissingRecordRepoTransBlockDao,
		repositoryTransactionBlockDao: IRepositoryTransactionBlockDao
	): Promise<IRepositoryTransactionBlock[]> {
		if (foundMissingRecordIds.length) {
			return []
		}
		const existingRepoTransBlocksWithCompatibleApplicationsAndData =
			await repositoryTransactionBlockDao.findWithMissingRecordIdsAndNoMissingRecordsWithStatus(
				foundMissingRecordIds,
				MissingRecordStatus.MISSING
			)

		await missingRecordRepoTransBlockDao.deleteWhereMissingRecordIdsIn(foundMissingRecordIds)
		await missingRecordDao.deleteWhereIdsIn(foundMissingRecordIds)

		return existingRepoTransBlocksWithCompatibleApplicationsAndData
	}

}

DI.set(SYNC_IN_DATA_CHECKER, SyncInDataChecker)
