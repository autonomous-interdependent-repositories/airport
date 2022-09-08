import {
	IEntityVDescriptor,
	IVBooleanField,
	IVDateField,
	IVNumberField,
	IVStringField,
	IVUntypedField,
} from '@airbridge/validate';
import {
	RepositoryVDescriptor,
} from '../repository/vRepository';
import {
	Repository,
} from '../../ddl/repository/Repository';
import {
	TransactionHistoryVDescriptor,
} from './vTransactionHistory';
import {
	TransactionHistory,
} from '../../ddl/history/TransactionHistory';
import {
	OperationHistoryVDescriptor,
} from './vOperationHistory';
import {
	OperationHistory,
} from '../../ddl/history/OperationHistory';
import {
	IRepositoryTransactionHistory,
} from './RepositoryTransactionHistory';



////////////////////
//  API INTERFACE //
////////////////////

export interface RepositoryTransactionHistoryVDescriptor<T>
    extends IEntityVDescriptor<T> {
	// Id Properties
	_localId?: number | IVNumberField;
	
	// Non-Id Properties
	repositoryTransactionType?: string | IVStringField;
	saveTimestamp?: number | IVNumberField;
	syncTimestamp?: number | IVNumberField;
	GUID?: string | IVStringField;
	isRepositoryCreation?: boolean | IVBooleanField;

	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	repository?: RepositoryVDescriptor<Repository>
	transactionHistory?: TransactionHistoryVDescriptor<TransactionHistory>
	operationHistory?: OperationHistoryVDescriptor<OperationHistory>

}


