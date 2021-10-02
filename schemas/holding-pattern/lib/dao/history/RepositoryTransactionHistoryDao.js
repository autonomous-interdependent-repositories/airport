import { AIRPORT_DATABASE, and, distinct, or, Y } from '@airport/air-control';
import { container, DI } from '@airport/di';
import { ChangeType, ensureChildArray, ensureChildJsMap, ensureChildJsSet, TransactionType } from '@airport/ground-control';
import { OPER_HISTORY_DUO, REC_HISTORY_DUO, REPO_TRANS_HISTORY_DAO, } from '../../tokens';
import { BaseRepositoryTransactionHistoryDao, Q } from '../../generated/generated';
export class RepositoryTransactionHistoryDao extends BaseRepositoryTransactionHistoryDao {
    getSelectClauseWithRecordHistory(operHistoryDuo, recHistoryDuo) {
        const id = Y;
        return {
            id,
            actor: {
                id
            },
            repository: {
                id
            },
            operationHistory: {
                ...operHistoryDuo.select.fields,
                entity: {
                    id: Y
                },
                recordHistory: {
                    ...recHistoryDuo.select.fields
                }
            },
        };
    }
    async findWhere(whereClauseFunction) {
        const [operHistoryDuo, recHistoryDuo] = await container(this).get(OPER_HISTORY_DUO, REC_HISTORY_DUO);
        let rth, r, oh, rh;
        const id = Y;
        return await this.db.find.tree({
            select: this.getSelectClauseWithRecordHistory(operHistoryDuo, recHistoryDuo),
            from: [
                rth = Q.RepositoryTransactionHistory,
                oh = rth.operationHistory.innerJoin(),
                rh = oh.recordHistory.innerJoin(),
            ],
            where: whereClauseFunction(rth, r, oh, rh)
        });
    }
    async findWhereIdsIn(idsInClause) {
        return await this.findWhere((rth) => rth.id.in(idsInClause));
    }
    async findWithActorAndRepositoryWhere(whereClauseFunction) {
        let rth, a, r;
        return await this.db.find.graph({
            select: {
                ...this.db.duo.select.fields,
                actor: {
                    uuId: Y,
                    user: {}
                },
                repository: {
                    createdAt: Y,
                    uuId: Y,
                    ownerActor: {}
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
        });
    }
    async findWithActorAndRepositoryWherIdsIn(idsInClause) {
        return await this.findWithActorAndRepositoryWhere((rth) => rth.id.in(idsInClause));
    }
    async findAllLocalChangesForRecordIds(changedRecordIds) {
        const repoTransHistoryMapByRepositoryId = new Map();
        /*
                const trafficPatternQSchema = this.airDb.QM[
                    getSchemaName('npmjs.org','@airport/traffic-pattern')
                    ]
        */
        const rth = Q.RepositoryTransactionHistory;
        const th = rth.transactionHistory.innerJoin();
        const oh = rth.operationHistory.leftJoin();
        const rh = oh.recordHistory.leftJoin();
        const nv = rh.newValues.leftJoin();
        let id = Y;
        const repositoryEquals = [];
        for (const [repositoryId, idsForRepository] of changedRecordIds) {
            const recordMapForRepository = idsForRepository.ids;
            const entityEquals = [];
            for (const [entityId, recordMapForEntity] of recordMapForRepository) {
                const actorEquals = [];
                for (const [actorId, recordsForActor] of recordMapForEntity) {
                    actorEquals.push(and(rh.actor.id.equals(actorId), rh.actorRecordId.in(Array.from(recordsForActor))));
                }
                entityEquals.push(and(oh.entity.id.equals(entityId), or(...actorEquals)));
            }
            repositoryEquals.push(and(rth.repository.id.equals(repositoryId), rth.saveTimestamp.greaterThanOrEquals(idsForRepository.firstChangeTime), or(...entityEquals)));
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
                    entity: {
                        index: Y,
                        schemaVersion: {
                            integerVersion: Y,
                            schema: {
                                index: Y
                            }
                        }
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
            where: and(th.transactionType.equals(TransactionType.LOCAL), or(...repositoryEquals)),
            orderBy: [
                rth.repository.id.asc(),
                oh.orderNumber.desc()
            ]
        });
        for (const repoTransHistory of repoTransHistories) {
            ensureChildArray(repoTransHistoryMapByRepositoryId, repoTransHistory.repository.id)
                .push(repoTransHistory);
            repoTransHistory.operationHistory.sort((rth1, rth2) => {
                if (rth1.orderNumber < rth2.orderNumber) {
                    return -1;
                }
                if (rth1.orderNumber > rth2.orderNumber) {
                    return 1;
                }
                return 0;
            });
        }
        return repoTransHistoryMapByRepositoryId;
    }
    async findExistingRecordIdMap(recordIdMap) {
        const existingRecordIdMap = new Map();
        const rth = Q.RepositoryTransactionHistory, oh = rth.operationHistory.innerJoin(), rh = oh.recordHistory.innerJoin();
        const idsFragments = [];
        for (const [repositoryId, recordIdMapForRepository] of recordIdMap) {
            let tableFragments = [];
            for (const [entityId, recordIdMapForTableInRepository] of recordIdMapForRepository) {
                let actorIdsFragments = [];
                for (const [actorId, recordIdSetForActor] of recordIdMapForTableInRepository) {
                    actorIdsFragments.push(and(rh.actor.id.equals(actorId), rh.actorRecordId.in(Array.from(recordIdSetForActor))));
                }
                tableFragments.push(and(oh.entity.id.equals(entityId), or(...actorIdsFragments)));
            }
            idsFragments.push(and(rth.repository.id.equals(repositoryId), oh.changeType.equals(ChangeType.INSERT_VALUES), or(...tableFragments)));
        }
        const airDb = await container(this).get(AIRPORT_DATABASE);
        const records = await airDb.find.sheet({
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
        });
        for (const record of records) {
            ensureChildJsSet(ensureChildJsMap(ensureChildJsMap(existingRecordIdMap, record[0]), record[1]), record[2]).add(record[3]);
        }
        return existingRecordIdMap;
    }
    async setBlockIdWhereId(getSetClause) {
        const rth = this.db.from;
        return await this.db.updateWhere({
            update: rth,
            set: {
                blockId: getSetClause(rth.id)
            }
        });
    }
}
DI.set(REPO_TRANS_HISTORY_DAO, RepositoryTransactionHistoryDao);
//# sourceMappingURL=RepositoryTransactionHistoryDao.js.map