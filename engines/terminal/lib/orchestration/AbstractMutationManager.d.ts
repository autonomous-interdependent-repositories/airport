import { AbstractQuery, IFieldUtils, IQEntity, IQueryUtils } from '@airport/air-control';
import { IContext } from '@airport/di';
import { PortableQuery, QueryResultType } from '@airport/ground-control';
import { ITransaction } from '@airport/terminal-map';
export declare class AbstractMutationManager {
    protected getPortableQuery(schemaIndex: number, tableIndex: number, query: AbstractQuery, queryResultType: QueryResultType, queryUtils: IQueryUtils, fieldUtils: IFieldUtils): PortableQuery;
    protected doInsertValues<IQE extends IQEntity<any>>(transaction: ITransaction, q: IQEntity<any>, entities: any[], context: IContext): Promise<number>;
}
//# sourceMappingURL=AbstractMutationManager.d.ts.map