import { DI } from '@airport/di';
import { RecordHistory } from '../../ddl/ddl';
import { REC_HISTORY_DUO } from '../../tokens';
import { BaseRecordHistoryDuo, } from '../../generated/generated';
export class RecordHistoryDuo extends BaseRecordHistoryDuo {
    getNewRecord(actorRecordId) {
        const recordHistory = new RecordHistory();
        recordHistory.actorRecordId = actorRecordId;
        return recordHistory;
    }
    addNewValue(recordHistory, dbColumn, newValue, recHistoryNewValueDuo) {
        const recordHistoryNewValue = recHistoryNewValueDuo.getNewRecord(recordHistory, dbColumn, newValue);
        recordHistory.newValues.push(recordHistoryNewValue);
        recordHistory.operationHistory.repositoryTransactionHistory
            .transactionHistory.allRecordHistoryNewValues.push(recordHistoryNewValue);
        return recordHistoryNewValue;
    }
    addOldValue(recordHistory, dbColumn, oldValue, recHistoryOldValueDuo) {
        const recordHistoryOldValue = recHistoryOldValueDuo.getNewRecord(recordHistory, dbColumn, oldValue);
        recordHistory.oldValues.push(recordHistoryOldValue);
        recordHistory.operationHistory.repositoryTransactionHistory
            .transactionHistory.allRecordHistoryOldValues.push(recordHistoryOldValue);
        return recordHistoryOldValue;
    }
}
DI.set(REC_HISTORY_DUO, RecordHistoryDuo);
//# sourceMappingURL=RecordHistoryDuo.js.map