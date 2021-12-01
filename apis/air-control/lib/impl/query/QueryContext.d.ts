import { ITransactionalConnector } from '@airport/ground-control';
import { IAirportDatabase } from '../../lingo/AirportDatabase';
import { IQueryFacade } from '../../lingo/core/repository/DatabaseFacade';
import { IIocQueryContext, IQueryContext } from '../../lingo/query/QueryContext';
import { IEntityUtils } from '../../lingo/utils/EntityUtils';
import { IFieldUtils } from '../../lingo/utils/FieldUtils';
import { IQueryUtils } from '../../lingo/utils/QueryUtils';
import { IApplicationUtils } from '../../lingo/utils/ApplicationUtils';
export declare class IocQueryContext implements IIocQueryContext {
    airDb: IAirportDatabase;
    entityUtils: IEntityUtils;
    fieldUtils: IFieldUtils;
    init(): Promise<void>;
    queryFacade: IQueryFacade;
    queryUtils: IQueryUtils;
    applicationUtils: IApplicationUtils;
    transactionalConnector: ITransactionalConnector;
}
export interface IQueryContextLoader {
    ensure<E>(ctx: IQueryContext): Promise<void>;
}
export declare class QueryContextLoader implements IQueryContextLoader {
    ensure<E>(ctx: IQueryContext): Promise<void>;
}
//# sourceMappingURL=QueryContext.d.ts.map