import { IDbSchemaUtils } from './impl/query/DbSchemaUtils';
import { ITransactionalConnector } from './lingo/data/ITransactionalConnector';
import { IStoreDriver } from './lingo/data/StoreDriver';
export declare const DB_SCHEMA_UTILS: import("@airport/di").DiToken<IDbSchemaUtils>;
export declare const STORE_DRIVER: import("@airport/di").DiToken<IStoreDriver>;
export declare const TRANS_CONNECTOR: import("@airport/di").DiToken<ITransactionalConnector>;