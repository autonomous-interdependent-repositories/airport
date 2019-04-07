import {DI}                               from '@airport/di'
import {TransactionType}                  from '@airport/ground-control'
import {TransactionHistory}               from '../../ddl/ddl'
import {
	REPO_TRANS_HISTORY_DUO,
	TRANS_HISTORY_DUO
}                                         from '../../diTokens'
import {
	BaseTransactionHistoryDuo,
	IActor,
	IRepository,
	IRepositoryTransactionHistory,
	ITransactionHistory,
}                                         from '../../generated/generated'
import {IRepositoryTransactionHistoryDuo} from './RepositoryTransactionHistoryDuo'

export interface ITransactionHistoryDuo {

	getNewRecord(
		transactionType?: TransactionType
	): ITransactionHistory;

	getRepositoryTransaction(
		transactionHistory: ITransactionHistory,
		repository: IRepository,
		actor: IActor,
	): IRepositoryTransactionHistory

}

export class TransactionHistoryDuo
	extends BaseTransactionHistoryDuo
	implements ITransactionHistoryDuo {

	private repoTransHistoryDuo: IRepositoryTransactionHistoryDuo

	constructor() {
		super()

		DI.get((
			repositoryTransactionHistoryDuo
		) => {
			this.repoTransHistoryDuo = repositoryTransactionHistoryDuo
		}, REPO_TRANS_HISTORY_DUO)
	}

	getNewRecord(
		transactionType: TransactionType = TransactionType.LOCAL
	): ITransactionHistory {
		let transaction = new TransactionHistory()

		transaction.transactionType = TransactionType.LOCAL

		return transaction
	}

	getRepositoryTransaction(
		transactionHistory: ITransactionHistory,
		repository: IRepository,
		actor: IActor,
	): IRepositoryTransactionHistory {
		let repoTransHistory = transactionHistory.repoTransHistoryMap[repository.id]

		if (!repoTransHistory) {
			repoTransHistory = this.repoTransHistoryDuo.getNewRecord(
				repository, actor)

			transactionHistory.repositoryTransactionHistories.push(repoTransHistory)
			transactionHistory.repoTransHistoryMap[repository.id] = repoTransHistory
		}

		return repoTransHistory
	}

}

DI.set(TRANS_HISTORY_DUO, TransactionHistoryDuo)