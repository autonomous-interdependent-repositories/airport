import { IEntityContext } from '@airport/air-control';
import { IContext } from '@airport/di';
import { AIRepository, ISaveResult, PortableQuery } from '@airport/ground-control';
import { Observable } from 'rxjs';
import { IQueryOperationContext } from '..';
import { ICredentials } from '../Credentials';
export interface ITransactionalServer {
    init(context?: IContext): Promise<void>;
    addRepository(credentials: ICredentials, context: IContext): Promise<number>;
    getApplicationRepositories(credentials: ICredentials, context: IContext): Promise<AIRepository[]>;
    find<E, EntityArray extends Array<E>>(portableQuery: PortableQuery, credentials: ICredentials, context: IQueryOperationContext, cachedSqlQueryId?: number): Promise<EntityArray>;
    findOne<E>(portableQuery: PortableQuery, credentials: ICredentials, context: IQueryOperationContext, cachedSqlQueryId?: number): Promise<E>;
    search<E, EntityArray extends Array<E>>(portableQuery: PortableQuery, credentials: ICredentials, context: IQueryOperationContext, cachedSqlQueryId?: number): Observable<EntityArray>;
    searchOne<E>(portableQuery: PortableQuery, credentials: ICredentials, context: IQueryOperationContext, cachedSqlQueryId?: number): Observable<E>;
    startTransaction(credentials: ICredentials, context: IContext): Promise<boolean>;
    commit(credentials: ICredentials, context: IContext): Promise<boolean>;
    rollback(credentials: ICredentials, context: IContext): Promise<boolean>;
    save<E>(entity: E, credentials: ICredentials, context: IEntityContext): Promise<ISaveResult>;
    saveToDestination<E>(repositoryDestination: string, entity: E, credentials: ICredentials, context: IEntityContext): Promise<ISaveResult>;
    insertValues(portableQuery: PortableQuery, credentials: ICredentials, context: IContext, ensureGeneratedValues?: boolean): Promise<number>;
    insertValuesGetIds(portableQuery: PortableQuery, credentials: ICredentials, context: IContext): Promise<number[][]>;
    updateValues(portableQuery: PortableQuery, credentials: ICredentials, context: IContext): Promise<number>;
    deleteWhere(portableQuery: PortableQuery, credentials: ICredentials, context: IContext): Promise<number>;
}
//# sourceMappingURL=ITransactionalServer.d.ts.map