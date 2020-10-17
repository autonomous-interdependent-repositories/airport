import { DI } from '@airport/di';
import { REC_HIST_OLD_VALUE_DAO } from '../../tokens';
import { BaseRecordHistoryOldValueDao } from '../../generated/generated';
import { Q } from '../../index';
export class RecordHistoryOldValueDao extends BaseRecordHistoryOldValueDao {
    async findByRecordHistoryIdIn(recordHistoryIds) {
        let rhov;
        return await this.db.find.tree({
            select: {},
            from: [
                rhov = Q.RecordHistoryOldValue
            ],
            where: rhov.recordHistory.id.in(recordHistoryIds)
        });
    }
}
DI.set(REC_HIST_OLD_VALUE_DAO, RecordHistoryOldValueDao);
//# sourceMappingURL=RecordHistoryOldValueDao.js.map