import { DI } from '@airport/di';
import { JSONClauseObjectType, QueryResultType } from '@airport/ground-control';
import { Q_VALIDATOR, SQL_QUERY_ADAPTOR } from '../tokens';
import { ExactOrderByParser } from '../orderBy/ExactOrderByParser';
import { ClauseType } from './core/SQLWhereBase';
import { NonEntitySQLQuery } from './NonEntitySQLQuery';
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
export class SheetSQLQuery extends NonEntitySQLQuery {
    constructor(jsonQuery, dialect, storeDriver) {
        super(jsonQuery, dialect, QueryResultType.SHEET, storeDriver);
        const validator = DI.db().getSync(Q_VALIDATOR);
        this.orderByParser = new ExactOrderByParser(validator);
    }
    getSELECTFragment(nested, selectClauseFragment, internalFragments, airDb, schemaUtils, metadataUtils) {
        if (!selectClauseFragment) {
            throw new Error(`SELECT clause is not defined for a Flat Query`);
        }
        {
            let distinctClause = selectClauseFragment;
            if (distinctClause.ot == JSONClauseObjectType.DISTINCT_FUNCTION) {
                let distinctSelect = this.getSELECTFragment(nested, distinctClause.af[0].p[0], internalFragments, airDb, schemaUtils, metadataUtils);
                return `DISTINCT ${distinctSelect}`;
            }
        }
        if (!(selectClauseFragment instanceof Array)) {
            throw new Error(`SELECT clause for a Flat Query must be an Array`);
        }
        let fieldIndex = 0;
        let selectSqlFragment = selectClauseFragment.map((field) => {
            return this.getFieldSelectFragment(field, ClauseType.NON_MAPPED_SELECT_CLAUSE, null, fieldIndex++, airDb, schemaUtils, metadataUtils);
        }).join('');
        const selectClause = internalFragments.SELECT;
        if (selectClause && selectClause.length) {
            if (fieldIndex) {
                selectSqlFragment += '\n\t,';
            }
            selectSqlFragment += selectClause
                .map(dbColumn => `${dbColumn.name}`)
                .join('\n\t,');
        }
        return selectSqlFragment;
    }
    async parseQueryResults(airDb, schemaUtils, results, internalFragments) {
        let parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        let lastResult;
        results.forEach((result) => {
            let parsedResult = this.parseQueryResult(this.jsonQuery.S, result, [0], internalFragments);
            parsedResults.push(parsedResult);
        });
        return parsedResults;
    }
    parseQueryResult(selectClauseFragment, resultRow, nextFieldIndex, internalFragments) {
        const sqlAdaptor = DI.db().getSync(SQL_QUERY_ADAPTOR);
        const resultsFromSelect = selectClauseFragment.map((field) => {
            let propertyValue = sqlAdaptor.getResultCellValue(resultRow, field.fa, nextFieldIndex[0], field.dt, null);
            nextFieldIndex[0]++;
            return propertyValue;
        });
        const selectClause = internalFragments.SELECT;
        if (selectClause && selectClause.length) {
            for (const dbColumn of selectClause) {
                let propertyValue = sqlAdaptor.getResultCellValue(resultRow, dbColumn.name, nextFieldIndex[0], dbColumn.type, null);
                resultsFromSelect.push(propertyValue);
                nextFieldIndex[0]++;
            }
        }
        return resultsFromSelect;
    }
}
//# sourceMappingURL=SheetSQLQuery.js.map