import { DI } from '@airport/di';
import { TransactionType } from '@airport/ground-control';
import { TransactionHistory } from '../../ddl/ddl';
import { TRANS_HISTORY_DUO } from '../../tokens';
import { BaseTransactionHistoryDuo, } from '../../generated/generated';
export class TransactionHistoryDuo extends BaseTransactionHistoryDuo {
    getNewRecord(transactionType = TransactionType.LOCAL) {
        let transaction = new TransactionHistory();
        transaction.transactionType = TransactionType.LOCAL;
        return transaction;
    }
    getRepositoryTransaction(transactionHistory, repositoryId, actor, repoTransHistoryDuo) {
        let repoTransHistory = transactionHistory.repoTransHistoryMap[repositoryId];
        if (!repoTransHistory) {
            repoTransHistory = repoTransHistoryDuo.getNewRecord(repositoryId, actor);
            transactionHistory.repositoryTransactionHistories.push(repoTransHistory);
            transactionHistory.repoTransHistoryMap[repositoryId] = repoTransHistory;
        }
        return repoTransHistory;
    }
}
DI.set(TRANS_HISTORY_DUO, TransactionHistoryDuo);
//# sourceMappingURL=TransactionHistoryDuo.js.map