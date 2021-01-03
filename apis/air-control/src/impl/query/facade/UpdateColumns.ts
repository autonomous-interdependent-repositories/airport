import {
	IEntityUpdateColumns,
	IQEntity,
	IQEntityInternal
}                         from '../../../lingo/core/entity/Entity'
import {RawUpdateColumns} from '../../../lingo/query/facade/Update'
import {IFieldUtils}      from '../../../lingo/utils/FieldUtils'
import {IQueryUtils}      from '../../../lingo/utils/QueryUtils'
import {QField}           from '../../core/field/Field'
import {wrapPrimitive}    from '../../core/field/WrapperFunctions'
import {AbstractUpdate}   from './AbstractUpdate'

export class UpdateColumns<IEUC extends IEntityUpdateColumns, IQE extends IQEntity<any>>
	extends AbstractUpdate<IQE, RawUpdateColumns<IEUC, IQE>> {

	constructor(
		rawUpdate: RawUpdateColumns<IEUC, IQE>
	) {
		super(rawUpdate)
	}

	protected setToJSON(
		set: any,
		queryUtils: IQueryUtils,
		fieldUtils: IFieldUtils
	): IEUC {
		const setClause: IEUC = <IEUC>{}
		const dbEntity        = (<IQEntityInternal<any>><any>this.rawUpdate.update)
			.__driver__.dbEntity
		const dbColumnMap     = dbEntity.columnMap
		const idDbColumnMap   = dbEntity.idColumnMap
		for (const columnName in set) {
			let value = set[columnName]
			if (value === undefined) {
				delete set[columnName]
				continue
			}
			if (!dbColumnMap[columnName]) {
				throw new Error(`
	Unknown column: '${columnName}' for entity: '${dbEntity.name}'
			(table: '${dbEntity.tableConfig.name}').
				`)
			}
			if (idDbColumnMap[columnName]) {
				throw new Error(`
	Cannot update @Id columns:
	Column: '${columnName}' for entity: '${dbEntity.name}'
			(table: '${dbEntity.tableConfig.name}').
				`)
			}
			value = wrapPrimitive(value)
			if (!value.toJSON) {
				throw `Unexpected value ${JSON.stringify(value)} for property ${columnName} of entity ${(<IQEntityInternal<any>><any>this.rawUpdate.update).__driver__.dbEntity.name}`
			}
			setClause[columnName] = (<QField<any>>value).toJSON(
				this.columnAliases, false, queryUtils, fieldUtils)
		}

		return setClause
	}

}
