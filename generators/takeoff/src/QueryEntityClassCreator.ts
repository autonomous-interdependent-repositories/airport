import {
	AIR_DB,
	IAirportDatabase,
	IUtils,
	orderSchemasInOrderOfPrecedence,
	QSchema,
	QSchemaInternal,
	setQSchemaEntities,
	UTILS
}                                   from '@airport/air-control'
import {DI}                         from '@airport/di'
import {
	DbSchema
}                                   from '@airport/ground-control'
import {ISchema}                    from '@airport/traffic-pattern'
import {QUERY_ENTITY_CLASS_CREATOR} from './diTokens'

// https://github.com/russoturisto/tarmaq/blob/master/src/generated/data/schema/qRepositorySchema.ts

export interface IQueryEntityClassCreator {

	createAll(
		schemas: ISchema[]
	): void

}

export class QueryEntityClassCreator
	implements IQueryEntityClassCreator {

	private airDb: IAirportDatabase
	private utils: IUtils

	constructor() {
		DI.get((
			airportDatabase,
			utils,
		) => {
			this.airDb         = airportDatabase
			this.utils         = utils
		}, AIR_DB, UTILS)
	}

	createAll(
		schemas: ISchema[]
	): void {
		const schemasToCreate = orderSchemasInOrderOfPrecedence(<any>schemas)
		schemasToCreate.map(
			dbSchema => this.create(dbSchema))
	}

	create(
		dbSchema: DbSchema
	): QSchema {
		let qSchema: QSchemaInternal = this.airDb.QM[dbSchema.name] as QSchemaInternal
		// If the Schema API source has already been loaded
		if (qSchema) {
			qSchema.__dbSchema__ = dbSchema
		} else {
			qSchema                      = {
				__constructors__: {},
				__qConstructors__: {},
				__dbSchema__: dbSchema,
				name: dbSchema.name,
				domain: dbSchema.domain.name
			}
			this.airDb.QM[dbSchema.name] = qSchema
		}
		this.airDb.Q[dbSchema.index] = qSchema
		setQSchemaEntities(dbSchema, qSchema, this.airDb.qSchemas)

		return qSchema
	}

}

DI.set(QUERY_ENTITY_CLASS_CREATOR, QueryEntityClassCreator)
