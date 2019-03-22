import {
	and,
	distinct,
	IQNumberField,
	JSONLogicalOperation,
	or,
	RawFieldQuery,
	Y
}           from '@airport/air-control'
import {DI} from '@airport/di'
import {
	ChangeType,
	EntityId,
	JSONBaseOperation,
	TransactionType
}           from '@airport/ground-control'
import {
	IOperationHistoryDmo,
	IRecordHistoryDmo
}           from '../..'
import {
	ActorId,
	RecordHistoryActorRecordId,
	RepositoryEntityActorRecordId,
	RepositoryId,
	RepositoryTransactionHistoryId
}           from '../../ddl/ddl'
import {
	OPER_HISTORY_DMO,
	REC_HISTORY_DMO,
	REPO_TRANS_HISTORY_DAO,
}           from '../../diTokens'
import {
	BaseRepositoryTransactionHistoryDao,
	IOperationHistory,
	IRepositoryTransactionHistory,
	Q,
	QActor,
	QOperationHistory,
	QRecordHistory,
	QRecordHistoryNewValue,
	QRepository,
	QRepositoryTransactionHistory,
	QTransactionHistory,
	RepositoryTransactionHistoryESelect
}           from '../../generated/generated'

export interface IRepositoryTransactionHistoryDao {

	getSelectClauseWithRecordHistory(): RepositoryTransactionHistoryESelect;

	findWhere(
		whereClauseFunction: {
			(
				rth: QRepositoryTransactionHistory,
				r: QRepository,
				oh?: QOperationHistory,
				rh?: QRecordHistory,
				rhnv?: QRecordHistoryNewValue
			): JSONLogicalOperation
		}
	): Promise<IRepositoryTransactionHistory[]>;

	findWhereIdsIn(
		idsInClause: RepositoryTransactionHistoryId[]
			| RawFieldQuery<IQNumberField>
			| {
			(...args: any[]): RawFieldQuery<IQNumberField>
		}
	): Promise<IRepositoryTransactionHistory[]>;

	findExistingRecordIdMap(
		recordIdMap: Map<RepositoryId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntityActorRecordId>>>>
	): Promise<Map<RepositoryId,
		Map<EntityId, Map<ActorId, Set<RepositoryEntityActorRecordId>>>>>;

	// updateSyncStatusHistory(
	// 	syncStatus: SyncStatus,
	// 	repoTransHistoryIds: RepositoryTransactionHistoryId[]
	// ): Promise<void>;

	findAllLocalChangesForRecordIds(
		changedRecordIds: Map<RepositoryId, IChangedRecordIdsForRepository>
	): Promise<Map<RepositoryId, IRepositoryTransactionHistory[]>>;

}

export interface IChangedRecordIdsForRepository {
	ids: Map<EntityId, Map<ActorId, Set<RecordHistoryActorRecordId>>>;
	firstChangeTime: Date;
}

export class RepositoryTransactionHistoryDao
	extends BaseRepositoryTransactionHistoryDao
	implements IRepositoryTransactionHistoryDao {

	private operHistoryDmo: IOperationHistoryDmo
	private recHistoryDmo: IRecordHistoryDmo

	constructor() {
		super()

		DI.get((
			operationHistoryDmo,
			recordHistoryDmo
		) => {
			this.operHistoryDmo = operationHistoryDmo
			this.recHistoryDmo    = recordHistoryDmo
		}, OPER_HISTORY_DMO, REC_HISTORY_DMO)
	}

	getSelectClauseWithRecordHistory(): RepositoryTransactionHistoryESelect {
		const id = Y
		return {
			id,
			actor: {
				id
			},
			repository: {
				id
			},
			operationHistory: {
				...this.operHistoryDmo.getAllFieldsSelect(),
				entity: {
					id: Y
				},
				recordHistory: {
					...this.recHistoryDmo.getAllFieldsSelect()
				}
			},
		}
	}

	async findWhere(
		whereClauseFunction: {
			(
				rth: QRepositoryTransactionHistory,
				r: QRepository,
				oh?: QOperationHistory,
				rh?: QRecordHistory,
			): JSONBaseOperation
		}
	): Promise<IRepositoryTransactionHistory[]> {
		let rth: QRepositoryTransactionHistory,
		    r: QRepository,
		    oh: QOperationHistory,
		    rh: QRecordHistory
		const id = Y
		return await this.db.find.tree({
			select: this.getSelectClauseWithRecordHistory(),
			from: [
				rth = Q.RepositoryTransactionHistory,
				oh = rth.operationHistory.innerJoin(),
				rh = oh.recordHistory.innerJoin(),
			],
			where: whereClauseFunction(rth, r, oh, rh)
		})
	}

	async findWhereIdsIn(
		idsInClause: RepositoryTransactionHistoryId[]
			| RawFieldQuery<IQNumberField>
			| {
			(...args: any[]): RawFieldQuery<IQNumberField>
		},
	): Promise<IRepositoryTransactionHistory[]> {
		return await this.findWhere((
			rth: QRepositoryTransactionHistory
		) => rth.id.in(idsInClause))
	}


	async findWithActorAndRepositoryWhere(
		whereClauseFunction: {
			(
				rth: QRepositoryTransactionHistory,
				a: QActor,
				r: QRepository,
			): JSONBaseOperation
		}
	): Promise<IRepositoryTransactionHistory[]> {
		let rth: QRepositoryTransactionHistory,
		    a: QActor,
		    r: QRepository
		return await this.db.find.graph({
			select: {
				...this.db.dmo.getAllFieldsSelect(),
				actor: {
					user: {},
					database: {},
				},
				repository: {
					orderedId: Y,
					randomId: Y,
					actor: {}
				},
				transactionHistory: {
					id: Y
				}
			},
			from: [
				rth = Q.RepositoryTransactionHistory,
				a = rth.actor.innerJoin(),
				r = rth.repository.innerJoin(),
			],
			where: whereClauseFunction(rth, a, r)
		})
	}

	async findWithActorAndRepositoryWherIdsIn(
		idsInClause: RepositoryTransactionHistoryId[]
			| RawFieldQuery<IQNumberField>
			| {
			(...args: any[]): RawFieldQuery<IQNumberField>
		}
	): Promise<IRepositoryTransactionHistory[]> {
		return await this.findWithActorAndRepositoryWhere((
			rth
		) => rth.id.in(idsInClause))
	}

	async findAllLocalChangesForRecordIds(
		changedRecordIds: Map<RepositoryId, IChangedRecordIdsForRepository>
	): Promise<Map<RepositoryId, IRepositoryTransactionHistory[]>> {
		const repoTransHistoryMapByRepositoryId: Map<RepositoryId, IRepositoryTransactionHistory[]>
			      = new Map()

		const trafficPatternQSchema = this.airDb.qSchemaMapByName['@airport/traffic-pattern']

		const rth: QRepositoryTransactionHistory = Q.RepositoryTransactionHistory
		const th: QTransactionHistory            = rth.transactionHistory.innerJoin()
		const oh: QOperationHistory              = rth.operationHistory.leftJoin()
		const rh: QRecordHistory                 = oh.recordHistory.leftJoin()
		const nv: QRecordHistoryNewValue         = rh.newValues.leftJoin()
		let id                                   = Y

		const repositoryEquals: JSONBaseOperation[] = []
		for (const [repositoryId, idsForRepository] of changedRecordIds) {
			const recordMapForRepository            = idsForRepository.ids
			const entityEquals: JSONBaseOperation[] = []
			for (const [entityId, recordMapForEntity] of recordMapForRepository) {
				const actorEquals: JSONBaseOperation[] = []
				for (const [actorId, recordsForActor] of recordMapForEntity) {
					actorEquals.push(and(
						rh.actor.id.equals(actorId),
						rh.actorRecordId.in(Array.from(recordsForActor))
					))
				}
				entityEquals.push(and(
					oh.entity.id.equals(entityId),
					or(...actorEquals)
				))
			}
			repositoryEquals.push(and(
				rth.repository.id.equals(repositoryId),
				rth.saveTimestamp.greaterThanOrEquals(idsForRepository.firstChangeTime),
				or(...entityEquals)
			))
		}

		const repoTransHistories = await this.db.find.tree({
			select: {
				actor: {
					id
				},
				repository: {
					id
				},
				saveTimestamp: Y,
				operationHistory: {
					orderNumber: Y,
					changeType: Y,
					schema: {
						index: Y
					},
					entity: {
						index: Y
					},
					recordHistory: {
						newValues: {
							columnIndex: Y,
							newValue: Y
						}
					}
				}
			},
			from: [
				th,
				rth,
				oh,
				rh,
				nv

			],
			where: and(
				th.transactionType.equals(TransactionType.LOCAL),
				or(...repositoryEquals)
			),
			orderBy: [
				rth.repository.id.asc(),
				oh.orderNumber.desc()
			]
		})

		for (const repoTransHistory of repoTransHistories) {
			this.utils.ensureChildArray(
				repoTransHistoryMapByRepositoryId, repoTransHistory.repository.id)
				.push(repoTransHistory)
			repoTransHistory.operationHistory.sort((
				rth1: IOperationHistory,
				rth2: IOperationHistory
			) => {
				if (rth1.orderNumber < rth2.orderNumber) {
					return -1
				}
				if (rth1.orderNumber > rth2.orderNumber) {
					return 1
				}
				return 0
			})
		}

		return repoTransHistoryMapByRepositoryId
	}

	async findExistingRecordIdMap(
		recordIdMap: Map<RepositoryId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntityActorRecordId>>>>
	): Promise<Map<RepositoryId,
		Map<EntityId, Map<ActorId, Set<RepositoryEntityActorRecordId>>>>> {
		const existingRecordIdMap: Map<RepositoryId,
			Map<EntityId, Map<ActorId, Set<RepositoryEntityActorRecordId>>>>
			      = new Map()

		const rth = Q.RepositoryTransactionHistory,
		      oh  = rth.operationHistory.innerJoin(),
		      rh  = oh.recordHistory.innerJoin()

		const idsFragments: JSONBaseOperation[] = []
		for (const [repositoryId, recordIdMapForRepository] of recordIdMap) {
			let tableFragments: JSONBaseOperation[] = []
			for (const [entityId, recordIdMapForTableInRepository]
				of recordIdMapForRepository) {

				let actorIdsFragments: JSONBaseOperation[] = []
				for (const [actorId, recordIdSetForActor] of recordIdMapForTableInRepository) {
					actorIdsFragments.push(and(
						rh.actor.id.equals(actorId),
						rh.actorRecordId.in(Array.from(recordIdSetForActor))
					))
				}
				tableFragments.push(and(
					oh.entity.id.equals(entityId),
					or(...actorIdsFragments)
				))
			}
			idsFragments.push(and(
				rth.repository.id.equals(repositoryId),
				oh.changeType.equals(ChangeType.INSERT_VALUES),
				or(...tableFragments)
			))
		}

		const records = await this.airDb.find.sheet({
			from: [
				rth,
				oh,
				rh
			],
			select: distinct([
				rth.repository.id,
				oh.entity.id,
				rh.actor.id,
				rh.actorRecordId
			]),
			where: or(...idsFragments)
		})

		for (const record of records) {
			this.utils.ensureChildJsSet(
				this.utils.ensureChildJsMap(
					this.utils.ensureChildJsMap(existingRecordIdMap, record[0]),
					record[1]), record[2]
			).add(record[3])
		}

		return existingRecordIdMap
	}

}

DI.set(REPO_TRANS_HISTORY_DAO, RepositoryTransactionHistoryDao)
