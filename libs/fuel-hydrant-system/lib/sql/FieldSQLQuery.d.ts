import { IAirportDatabase, IQMetadataUtils, ISchemaUtils } from '@airport/air-control';
import { InternalFragments, IStoreDriver, JsonFieldQuery } from '@airport/ground-control';
import { SQLDialect } from './core/SQLQuery';
import { NonEntitySQLQuery } from './NonEntitySQLQuery';
/**
 * Created by Papa on 10/29/2016.
 */
export declare class FieldSQLQuery extends NonEntitySQLQuery<JsonFieldQuery> {
    constructor(jsonQuery: JsonFieldQuery, dialect: SQLDialect, storeDriver: IStoreDriver);
    protected getSELECTFragment(nested: boolean, selectClauseFragment: any, internalFragments: InternalFragments, airDb: IAirportDatabase, schemaUtils: ISchemaUtils, metadataUtils: IQMetadataUtils): string;
    parseQueryResults(airDb: IAirportDatabase, schemaUtils: ISchemaUtils, results: any[]): Promise<any[]>;
    protected parseQueryResult(selectClauseFragment: any, resultRow: any, nextFieldIndex: number[]): any;
}
//# sourceMappingURL=FieldSQLQuery.d.ts.map