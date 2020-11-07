import {
	IAirportDatabase,
	IQEntity,
	IQEntityInternal,
	ISchemaUtils,
	QEntity,
	QRelation
}                     from '@airport/air-control'
import {
	DbEntity,
	IStoreDriver,
	JSONEntityRelation
}                     from '@airport/ground-control'
import {SQLDialect}   from './SQLQuery'
import {SQLWhereBase} from './SQLWhereBase'

/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLNoJoinQuery
	extends SQLWhereBase {

	constructor(
		dbEntity: DbEntity,
		dialect: SQLDialect,
		storeDriver: IStoreDriver
	) {
		super(dbEntity, dialect, storeDriver)
	}

	protected getTableFragment(
		fromRelation: JSONEntityRelation,
		airDb: IAirportDatabase,
		schemaUtils: ISchemaUtils,
		addAs: boolean = true
	): string {
		if (!fromRelation) {
			throw new Error(`Expecting exactly one table in UPDATE/DELETE clause`)
		}
		if (fromRelation.ri || fromRelation.jt) {
			throw new Error(`Table in UPDATE/DELETE clause cannot be joined`)
		}

		const firstDbEntity: DbEntity = airDb.schemas[fromRelation.si]
			.currentVersion.entities[fromRelation.ti]
		let tableName                 = this.storeDriver.getEntityTableName(firstDbEntity)
		if (fromRelation.si !== this.dbEntity.schemaVersion.schema.index
			|| fromRelation.ti !== this.dbEntity.index) {
			throw new Error(`Unexpected table in UPDATE/DELETE clause: 
			'${tableName}',
			expecting: '${this.dbEntity.schemaVersion.schema.name}.${this.dbEntity.name}'`)
		}

		const firstQEntity: IQEntity = new QEntity(firstDbEntity)

		const tableAlias                   = QRelation.getAlias(fromRelation)
		this.qEntityMapByAlias[tableAlias] = firstQEntity as IQEntityInternal
		let fromFragment                 = `\t${tableName}`;
		if(addAs) {
			fromFragment += ` AS ${tableAlias}`
		}

		return fromFragment
	}

}
