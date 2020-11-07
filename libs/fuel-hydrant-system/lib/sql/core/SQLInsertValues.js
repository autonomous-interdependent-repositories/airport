import { DI } from '@airport/di';
import { Q_VALIDATOR, SQL_QUERY_ADAPTOR } from '../../tokens';
import { SQLNoJoinQuery } from './SQLNoJoinQuery';
import { ClauseType } from './SQLWhereBase';
/**
 * Created by Papa on 11/17/2016.
 */
export class SQLInsertValues extends SQLNoJoinQuery {
    constructor(airportDb, jsonInsertValues, dialect, storeDriver
    // repository?: IRepository
    ) {
        super(airportDb.schemas[jsonInsertValues.II.si]
            .currentVersion.entities[jsonInsertValues.II.ti], dialect, storeDriver);
        this.jsonInsertValues = jsonInsertValues;
    }
    toSQL(airDb, schemaUtils, metadataUtils) {
        const validator = DI.db()
            .getSync(Q_VALIDATOR);
        if (!this.jsonInsertValues.II) {
            throw new Error(`Expecting exactly one table in INSERT INTO clause`);
        }
        validator.validateInsertQEntity(this.dbEntity);
        let tableFragment = this.getTableFragment(this.jsonInsertValues.II, airDb, schemaUtils, false);
        let columnsFragment = this.getColumnsFragment(this.dbEntity, this.jsonInsertValues.C);
        let valuesFragment = this.getValuesFragment(this.jsonInsertValues.V, airDb, schemaUtils, metadataUtils);
        return `INSERT INTO
${tableFragment} ${columnsFragment}
VALUES
${valuesFragment}
`;
    }
    getColumnsFragment(dbEntity, columns) {
        if (!columns.length) {
            return '';
        }
        const columnNames = columns.map(columnIndex => dbEntity.columns[columnIndex].name);
        return `( ${columnNames.join(', \n')} )`;
    }
    getValuesFragment(valuesClauseFragment, airDb, schemaUtils, metadataUtils) {
        const sqlAdaptor = DI.db()
            .getSync(SQL_QUERY_ADAPTOR);
        let allValuesFragment = valuesClauseFragment.map((valuesArray) => {
            let valuesFragment = valuesArray.map((value) => {
                if (value === null || ['number', 'string'].indexOf(typeof value) > -1) {
                    this.parameterReferences.push(value);
                    return sqlAdaptor.getParameterReference(this.parameterReferences, value);
                }
                else {
                    const fieldValue = this.getFieldValue(value, ClauseType.WHERE_CLAUSE, null, airDb, schemaUtils, metadataUtils);
                    return `\n${fieldValue}\n`;
                }
            });
            return `(${valuesFragment.join(',')})`;
        });
        return allValuesFragment.join(',\n');
    }
}
//# sourceMappingURL=SQLInsertValues.js.map