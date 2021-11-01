import { AIRPORT_DATABASE } from '@airport/air-control';
import { SEQUENCE_DAO } from '@airport/airport-code';
import { container, DI } from '@airport/di';
import { getSchemaName, QueryType, SQLDataType } from '@airport/ground-control';
import { SCHEMA_BUILDER, SqlSchemaBuilder } from '@airport/landing';
export class PostgreSqlSchemaBuilder extends SqlSchemaBuilder {
    async createSchema(jsonSchema, storeDriver, context) {
        const schemaName = getSchemaName(jsonSchema);
        const createSchemaStatement = `CREATE SCHEMA ${schemaName}`;
        await storeDriver.query(QueryType.DDL, createSchemaStatement, [], context, false);
    }
    getColumnSuffix(jsonSchema, jsonEntity, jsonColumn) {
        let primaryKeySuffix = '';
        if (jsonColumn.notNull
            || this.isPrimaryKeyColumn(jsonEntity, jsonColumn)) {
            primaryKeySuffix = ' NOT NULL';
        }
        const suffix = primaryKeySuffix;
        switch (jsonColumn.type) {
            case SQLDataType.ANY:
                return suffix;
            case SQLDataType.BOOLEAN:
                return `INTEGER ${suffix}`;
            case SQLDataType.DATE:
                return `BIGINT ${suffix}`;
            case SQLDataType.JSON:
                return `TEXT ${suffix}`;
            case SQLDataType.NUMBER:
                return `NUMERIC(15,5) ${suffix}`;
            case SQLDataType.STRING:
                return `TEXT ${suffix}`;
            default:
                throw new Error(`Unexpected data type for column ${jsonSchema.name}.${jsonEntity.name}.${jsonColumn.name}`);
        }
    }
    getCreateTableSuffix(jsonSchema, jsonEntity) {
        return ``;
    }
    async buildAllSequences(jsonSchemas) {
        console.log('buildAllSequences');
        let [airDb, sequenceDao] = await container(this).get(AIRPORT_DATABASE, SEQUENCE_DAO);
        let allSequences = [];
        for (const jsonSchema of jsonSchemas) {
            const qSchema = airDb.QM[getSchemaName(jsonSchema)];
            for (const jsonEntity of jsonSchema.versions[jsonSchema.versions.length - 1].entities) {
                allSequences = allSequences.concat(this.buildSequences(qSchema.__dbSchema__, jsonEntity));
            }
        }
        await sequenceDao.save(allSequences);
        return allSequences;
    }
    stageSequences(jsonSchemas, airDb, context) {
        console.log('stageSequences');
        let stagedSequences = [];
        for (const jsonSchema of jsonSchemas) {
            const qSchema = airDb.QM[getSchemaName(jsonSchema)];
            for (const jsonEntity of jsonSchema.versions[jsonSchema.versions.length - 1].entities) {
                stagedSequences = stagedSequences.concat(this.buildSequences(qSchema.__dbSchema__, jsonEntity));
            }
        }
        return stagedSequences;
    }
    buildSequences(dbSchema, jsonEntity) {
        const sequences = [];
        for (const jsonColumn of jsonEntity.columns) {
            if (!jsonColumn.isGenerated) {
                continue;
            }
            let incrementBy = jsonColumn.allocationSize;
            if (!incrementBy) {
                incrementBy = 1000;
            }
            sequences.push({
                schemaIndex: dbSchema.index,
                tableIndex: jsonEntity.index,
                columnIndex: jsonColumn.index,
                incrementBy,
                currentValue: 0
            });
        }
        return sequences;
    }
    getIndexSql(indexName, tableName, columnNameList, unique) {
        let uniquePrefix;
        if (unique) {
            uniquePrefix = ' UNIQUE';
        }
        return `CREATE${uniquePrefix} INDEX ${indexName}
	  ON ${tableName} USING btree (
	  ${columnNameList.join(', ')}
	  )`;
    }
    getForeignKeySql(tableName, foreignKeyName, foreignKeyColumnNames, referencedTableName, referencedColumnNames) {
        return `ALTER TABLE ${tableName}
  ADD CONSTRAINT ${foreignKeyName}
  FOREIGN KEY (${foreignKeyColumnNames.join(', ')})
    REFERENCES ${referencedTableName} (${referencedColumnNames})
    ON DELETE Cascade
    ON UPDATE Cascade`;
    }
}
DI.set(SCHEMA_BUILDER, PostgreSqlSchemaBuilder);
//# sourceMappingURL=PostgreSqlSchemaBuilder.js.map