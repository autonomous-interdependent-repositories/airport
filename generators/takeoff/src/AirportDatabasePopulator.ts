import {
	AIR_DB,
	IAirportDatabase
}                         from '@airport/air-control'
import {DI}               from '@airport/di'
import {AIR_DB_POPULATOR} from './diTokens'

export interface IAirportDatabasePopulator {

	populate(): void;

}

export class AirportDatabasePopulator
	implements IAirportDatabasePopulator {

	private airDb: IAirportDatabase

	constructor() {
		DI.get((
			airportDatabase
		) => {
			this.airDb = airportDatabase
		}, AIR_DB)
	}

	populate(): void {
		this.airDb.schemas
		this.airDb.qSchemas
	}

}

DI.set(AIR_DB_POPULATOR, AirportDatabasePopulator)
