import {
	JsonSchema,
	JsonSchemaColumn,
	JsonSchemaEntity,
	SQLDataType
} from '@airport/ground-control'
import {Service}            from 'typedi'
import {SchemaBuilderToken} from '../../InjectionTokens'
import {SqlSchemaBuilder}   from '../SqlSchemaBuilder'

@Service(SchemaBuilderToken)
export class WebSqlSchemaBuilder
	extends SqlSchemaBuilder {

	constructor() {
		super()
	}

	getColumnType(
		jsonSchema: JsonSchema,
		jsonEntity: JsonSchemaEntity,
		jsonColumn: JsonSchemaColumn
	): string {
		const primaryKeySuffix = this.getPrimaryKeySuffix(jsonEntity, jsonColumn)

		let autoincrementSuffix = ''
		if(jsonColumn.isGenerated
			&& jsonSchema.name === '@airport/airportcode'
			&& jsonEntity.name === 'SEQUENCE_SETTINGS') {
		  autoincrementSuffix = ' AUTOINCREMENT'
		}

		const suffix = primaryKeySuffix + autoincrementSuffix

		switch (jsonColumn.type) {
			case SQLDataType.ANY:
				return suffix
			case SQLDataType.BOOLEAN:
				return `INTEGER ${suffix}`
			case SQLDataType.DATE:
				return `REAL ${suffix}`
			case SQLDataType.JSON:
				return `TEXT ${suffix}`
			case SQLDataType.NUMBER:
				if (suffix) {
					return `INTEGER ${suffix}`
				}
				return 'REAL'
			case SQLDataType.STRING:
				return `TEXT ${suffix}`
		}
	}

	protected getPrimaryKeyColumnSyntax(): string {
		let primaryKeySyntax = ' PRIMARY KEY'

		return primaryKeySyntax
	}

}