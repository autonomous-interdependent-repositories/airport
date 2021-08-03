import {
	abs,
	add,
	AIRPORT_DATABASE,
	and,
	avg,
	bool,
	concat,
	count,
	date,
	DATABASE_FACADE,
	distinct,
	divide,
	exists,
	format,
	FunctionsAndOperators,
	IAirportDatabase,
	IDatabaseFacade,
	IEntityAccumulator,
	IEntityContext,
	IEntityRecord,
	IEntityUpdateColumns,
	IEntityUpdateProperties,
	INonEntityFind,
	INonEntityFindOne,
	INonEntitySearch,
	INonEntitySearchOne,
	intersect,
	IQEntity,
	lcase,
	len,
	max,
	mid,
	min,
	minus,
	modulus,
	multiply,
	NonEntityFind,
	NonEntityFindOne,
	NonEntitySearch,
	NonEntitySearchOne,
	not,
	now,
	num,
	OperationName,
	or,
	QSchema,
	RawDelete,
	RawInsertColumnValues,
	RawInsertValues,
	RawUpdate,
	RawUpdateColumns,
	replace,
	round,
	str,
	subtract,
	sum,
	trim,
	ucase,
	union,
	unionAll,
	wrapPrimitive,
} from '@airport/air-control';
import {
	container,
	DI,
} from '@airport/di';
import {
	DbSchema,
	DistributionStrategy,
	ISaveResult,
	PlatformType,
} from '@airport/ground-control';

class EntityAccumulator
	implements IEntityAccumulator {

	constructor(
		private schemaDomain: string,
		private schemaName: string,
		private entityMap: Map<any, IEntityRecord>,
	) {
	}

	add(
		clazz: any,
		index: number,
	): void {
		this.entityMap.set(clazz, {
			entity: {
				index,
				name: clazz.name,
			},
			schema: {
				domain: this.schemaDomain,
				name: this.schemaName,
			},
		});
	}
}

export class AirportDatabase
	implements IAirportDatabase {

	db: IDatabaseFacade;

	entityMap: Map<any, IEntityRecord> = new Map<any, IEntityRecord>();

	F: FunctionsAndOperators;
	functions: FunctionsAndOperators = {
		abs,
		avg,
		count,
		max,
		min,
		sum,
		ucase,
		lcase,
		mid,
		len,
		round,
		now,
		format,
		replace,
		trim,
		distinct,
		exists,
		divide,
		subtract,
		modulus,
		multiply,
		add,
		concat,
		union,
		unionAll,
		intersect,
		minus,
		// logical operators
		and,
		not,
		or,
		// primitive wrappers
		bool,
		date,
		num,
		str,
		wrapPrimitive,
	};

	S: DbSchema[];
	schemas: DbSchema[] = [];

	qSchemas: QSchema[] = [];
	Q: QSchema[];

	QM: { [name: string]: QSchema } = {};

	find: INonEntityFind;
	findOne: INonEntityFindOne;
	search: INonEntitySearch;
	searchOne: INonEntitySearchOne;

	// private databaseMap: { [databaseName: string]: IDatabaseFacade } = {}
	// private dbNames: string[]                                        = []
	// private dbNameSet: { [databaseName: string]: boolean }           = {}

	// private currentDbName = dbConst.DEFAULT_DB

	constructor() {
		this.S = this.schemas;
		this.Q = this.qSchemas;

		this.find      = new NonEntityFind();
		this.findOne   = new NonEntityFindOne();
		this.search    = new NonEntitySearch();
		this.searchOne = new NonEntitySearchOne();
	}

	/*
		registerDatabase(
			facade: IDatabaseFacade
		) {
			if (!this.dbNameSet[facade.name]) {
				this.dbNames.push(facade.name)
			}
			this.databaseMap[facade.name] = facade
			this.dbNameSet[facade.name]   = true
		}

		async registerQSchemas(
			qSchemas: QSchema[]
		) {
			for (const qSchema of qSchemas) {
				const schemaName    = getSchemaName(qSchema)
				this.QM[schemaName] = qSchema
			}
		}

		setCurrentDb(
			dbName: string = dbConst.DEFAULT_DB
		): void {
			this.currentDbName = dbName
		}

		getDbNames(): string[] {
			return this.dbNames
		}

		getDbNameSet(): { [databaseName: string]: boolean } {
			return this.dbNameSet
		}

		get db(): IDatabaseFacade {
			let database = this.databaseMap[this.currentDbName]
			if (!database) {
				throw new Error(`Did not find database '${this.currentDbName}'`)
			}
			return database
		}
	*/

	getAccumulator(
		schemaDomain: string,
		schemaName: string,
	): IEntityAccumulator {
		return new EntityAccumulator(schemaDomain, schemaName, this.entityMap);
	}

	async addRepository(
		name: string,
		url: string,
		platform: PlatformType,
		platformConfig: string,
		distributionStrategy: DistributionStrategy,
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.addRepository(name, url, platform,
			platformConfig, distributionStrategy, context);
	}

	async insertColumnValues<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertColumnValues<IQE> | {
			(...args: any[]): RawInsertColumnValues<IQE>
		},
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.insertColumnValues(rawInsertValues, context);
	}

	async insertValues<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertValues<IQE> | {
			(...args: any[]): RawInsertValues<IQE>
		},
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.insertValues(rawInsertValues, context);
	}

	async insertColumnValuesGenerateIds<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertColumnValues<IQE> | {
			(...args: any[]): RawInsertColumnValues<IQE>
		},
		context?: IEntityContext,
	): Promise<number[] | string[] | number[][] | string[][]> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.insertColumnValuesGenerateIds(rawInsertValues, context);
	}

	async insertValuesGenerateIds<IQE extends IQEntity<any>>(
		rawInsertValues: RawInsertValues<IQE> | {
			(...args: any[]): RawInsertValues<IQE>
		},
		context?: IEntityContext,
	): Promise<number[] | string[] | number[][] | string[][]> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.insertValuesGenerateIds(rawInsertValues, context);
	}

	/**
	 * Creates an entity with a where clause - internal API.  Use the
	 *  API provided by the IEntityDatabaseFacade.
	 *
	 * @return Number of records deleted
	 */
	async deleteWhere<IQE extends IQEntity<any>>(
		rawDelete: RawDelete<IQE> | {
			(...args: any[]): RawDelete<IQE>
		},
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.deleteWhere(rawDelete, context);
	}

	/**
	 * Ether creates or updates an entity - internal API.  Use the
	 *  API provided by the IEntityDatabaseFacade.
	 *
	 * @return Number of records saved (1 or 0)
	 */
	async save<E>(
		entity: E,
		context?: IEntityContext,
		operationName?: OperationName,
	): Promise<ISaveResult> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.save(entity, context);
	}

	/**
	 * Updates an entity with a where clause, using a column based set clause
	 * - internal API.  Use the API provided by the IEntityDatabaseFacade.
	 *
	 * @return Number of records updated
	 */
	async updateColumnsWhere<IEUC extends IEntityUpdateColumns, IQE extends IQEntity<any>>(
		rawUpdateColumns: RawUpdateColumns<IEUC, IQE>
			| {
			(...args: any[]): RawUpdateColumns<IEUC, IQE>
		},
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.updateColumnsWhere(rawUpdateColumns, context);
	}

	/**
	 * Updates an entity with a where clause, using a property based set clause
	 * - internal API.  Use the API provided by the IEntityDatabaseFacade.
	 *
	 * @return Number of records updated
	 */
	async updateWhere<IEUP extends IEntityUpdateProperties, IQE extends IQEntity<any>>(
		rawUpdate: RawUpdate<IEntityUpdateProperties, IQE> | {
			(...args: any[]): RawUpdate<IEUP, IQE>
		},
		context?: IEntityContext,
	): Promise<number> {
		const dbFacade = await container(this)
			.get(DATABASE_FACADE);

		return await dbFacade.updateWhere(rawUpdate, context);
	}
}

DI.set(AIRPORT_DATABASE, AirportDatabase);

export function injectAirportDatabase(): void {
	// console.log('Injecting AirportDatabase');
}
