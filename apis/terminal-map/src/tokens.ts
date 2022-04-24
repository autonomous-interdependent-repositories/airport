import { lib } from '@airport/direction-indicator'
import { ITransactionManager } from './orchestration/TransactionManager'
import { ITerminalStore } from './store/TerminalStore'
import { ITransactionalServer } from './transaction/ITransactionalServer'
import { ITransactionalReceiver } from './transaction/ITransactionalReceiver'
import { IApplicationInitializer, IDomainRetriever } from '.'
import { IStoreDriver } from './core/data/StoreDriver'
import { OPERATION_CONTEXT_LOADER } from '@airport/ground-control'
import { SELECTOR_MANAGER } from '@airport/check-in'

const terminalMap = lib('terminal-map')

export const APPLICATION_INITIALIZER = terminalMap.token<IApplicationInitializer>('APPLICATION_INITIALIZER')
export const DOMAIN_RETRIEVER = terminalMap.token<IDomainRetriever>('DOMAIN_RETRIEVER')
export const STORE_DRIVER = terminalMap.token<IStoreDriver>('STORE_DRIVER');
export const TERMINAL_STORE = terminalMap.token<ITerminalStore>('TERMINAL_STORE')
export const TRANSACTION_MANAGER = terminalMap.token<ITransactionManager>('TRANSACTION_MANAGER')
export const TRANSACTIONAL_RECEIVER = terminalMap.token<ITransactionalReceiver>('TRANSACTIONAL_RECEIVER')
export const TRANSACTIONAL_SERVER = terminalMap.token<ITransactionalServer>('TRANSACTIONAL_SERVER')

TRANSACTIONAL_SERVER.setDependencies({
    operationContextLoader: OPERATION_CONTEXT_LOADER
})

TERMINAL_STORE.setDependencies({
    selectorManager: SELECTOR_MANAGER
})
