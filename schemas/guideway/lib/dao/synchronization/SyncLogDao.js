import { AIR_DB, and, max, min, tree } from '@airport/air-control';
import { container, DI } from '@airport/di';
import { AgtSharingMessageAcknowledged } from '../../ddl/ddl';
import { SYNC_LOG_DAO } from '../../tokens';
import { BaseSyncLogDao, Q } from '../../generated/generated';
export class SyncLogDao extends BaseSyncLogDao {
    async insertValues(values) {
        const dbEntity = Q.db.currentVersion.entityMapByName.RealtimeSyncLog;
        let sl;
        const airDb = await container(this).get(AIR_DB);
        await airDb.insertValues(dbEntity, {
            insertInto: sl = Q.SyncLog,
            columns: [
                sl.repositoryTransactionBlock.id,
                // sl.repositoryTransactionBlockAddDatetime,
                sl.sharingMessage.id,
            ],
            values
        });
    }
    async selectSyncedTerminalRepositories(fromDateInclusive, toDateExlusive, repositoryIds) {
        const syncedTerminalRepositories = [];
        const dbSyncStatuses = await this.selectTmSyncStatusForAgtRepositoryIds(fromDateInclusive, toDateExlusive, repositoryIds);
        for (const dbSyncStatus of dbSyncStatuses) {
            if (dbSyncStatus[2] === AgtSharingMessageAcknowledged.ACKNOWLEDGED) {
                syncedTerminalRepositories.push([dbSyncStatus[0], dbSyncStatus[1]]);
            }
        }
        return syncedTerminalRepositories;
    }
    /**
     * This query is input into insert of DailySyncLog records.
     *
     * Cursor consideration:  ORDER BY and Cursor may not work well together.  Cursor is not
     * as big of a need here, since the query is limited by repository ids and is only run
     * by the archival process.
     *
     * @param {AgtAgtRepositoryTransactionBlockAddDatetime} fromDateInclusive
     * @param {AgtAgtRepositoryTransactionBlockAddDatetime} toDateExlusive
     * @param {AgtRepositoryId[]} repositoryIds
     * @returns {Promise<TerminalSyncStatus[]>}
     */
    async selectTmSyncStatusForAgtRepositoryIds(fromDateInclusive, toDateExlusive, repositoryIds) {
        let sl, sm, rtb;
        // AgtRepositoryTransactionBlock Sub-Query
        const smrtb = tree({
            from: [
                sl = Q.SyncLog,
                sm = sl.sharingMessage.innerJoin(),
                rtb = sl.repositoryTransactionBlock.innerJoin()
            ],
            select: {
                repositoryTransactionBlockId: rtb.id,
                terminalId: sm.terminal.id,
                repositoryId: rtb.repository.id,
                maxAcked: max(sm.acknowledged),
            },
            where: and(
            // sl.repositoryTransactionBlockAddDatetime.greaterThanOrEquals(fromDateInclusive),
            // sl.repositoryTransactionBlockAddDatetime.lessThan(toDateExlusive),
            rtb.addDatetime.greaterThanOrEquals(fromDateInclusive), rtb.addDatetime.lessThan(toDateExlusive), rtb.repository.id.in(repositoryIds)),
            groupBy: [
                rtb.id,
                sm.terminal.id,
                rtb.repository.id
            ],
            orderBy: [
                rtb.repository.id.asc(),
                sm.terminal.id.asc(),
            ]
        });
        const airDb = await container(this).get(AIR_DB);
        return await airDb.find.sheet({
            from: [
                smrtb
            ],
            select: [
                smrtb.terminalId,
                smrtb.repositoryId,
                min(smrtb.maxAcked)
            ],
            groupBy: [
                smrtb.terminalId,
                smrtb.repositoryId
            ]
        });
    }
}
DI.set(SYNC_LOG_DAO, SyncLogDao);
//# sourceMappingURL=SyncLogDao.js.map