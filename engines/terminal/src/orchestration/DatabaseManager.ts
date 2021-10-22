import {
	AIRPORT_DATABASE
} from '@airport/air-control';
import {
	container,
	DI,
	IContext
} from '@airport/di';
import {
	getSchemaName,
	STORE_DRIVER,
} from '@airport/ground-control';
import {
	Actor,
} from '@airport/holding-pattern';
import { SCHEMA_INITIALIZER } from '@airport/landing';
import { ISchema, SCHEMA_DAO } from '@airport/traffic-pattern';
import {
	IDatabaseManager,
	TRANSACTIONAL_SERVER
} from '@airport/terminal-map';
import {
	DATABASE_MANAGER,
	INTERNAL_RECORD_MANAGER
} from '../tokens';
import { JsonSchemaWithLastIds } from '@airport/security-check';

export class DatabaseManager
	implements IDatabaseManager {

	private initialized = false;

	// constructor() {
	// }

	async initNoDb(
		context: IContext,
		...schemas: JsonSchemaWithLastIds[]
	): Promise<void> {
		await container(this).get(AIRPORT_DATABASE);

		const server = await container(this).get(TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();

		await this.installStarterSchema(true, false, context);

		const schemaInitializer = await container(this).get(SCHEMA_INITIALIZER);
		await schemaInitializer.stage(schemas, context);
		(server as any).tempActor = null;
		this.initialized = true;
	}

	async initWithDb(
		domainName: string,
		context: IContext
	): Promise<void> {
		await container(this).get(AIRPORT_DATABASE);

		const storeDriver = await container(this).get(STORE_DRIVER);
		/*
				await storeDriver.dropTable('air__airport_code', 'SEQUENCES')
				await storeDriver.dropTable('air__airport_code', 'TERMINAL_RUNS')
				await storeDriver.dropTable('air__holding_pattern', 'ACTOR_APPLICATION')
				await storeDriver.dropTable('air__holding_pattern', 'Actor')
				await storeDriver.dropTable('air__holding_pattern', 'Application')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_ACTORS')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_APPLICATION')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_OPERATION_HISTORY')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_RECORD_HISTORY')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_RECORD_HISTORY_NEW_VALUES')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_RECORD_HISTORY_OLD_VALUES')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_SCHEMAS')
				await storeDriver.dropTable('air__holding_pattern', 'REPOSITORY_TRANSACTION_HISTORY')
				await storeDriver.dropTable('air__holding_pattern', 'REPO_TRANS_HISTORY_CHANGED_REPOSITORY_ACTORS')
				await storeDriver.dropTable('air__holding_pattern', 'TRANSACTION_HISTORY')
				await storeDriver.dropTable('air__territory', 'APPLICATIONS')
				await storeDriver.dropTable('air__territory', 'APPLICATION_PACKAGES')
				await storeDriver.dropTable('air__territory', 'DOMAINS')
				await storeDriver.dropTable('air__territory', 'PACKAGED_UNITS')
				await storeDriver.dropTable('air__territory', 'PACKAGES')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMAS')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_COLUMNS')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_ENTITIES')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_PROPERTIES')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_PROPERTY_COLUMNS')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_REFERENCES')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_RELATIONS')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_RELATION_COLUMNS')
				await storeDriver.dropTable('air__traffic_pattern', 'SCHEMA_VERSIONS')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'Agt')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'TERMINAL_AGTS')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'Terminal')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'USER_TERMINAL')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'USER_TERMINAL_AGT')
				await storeDriver.dropTable('air__travel_document_checkpoint', 'User')
				*/
		/*
				await storeDriver.dropTable('votecube_com__ecclesia', 'CONTINENTS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'COUNTIES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'COUNTRIES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'FACTORS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'FACTOR_POSITIONS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'LABELS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLLS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_CONTINENTS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_COUNTIES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_COUNTRIES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_FACTOR_POSITIONS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_LABELS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_STATES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_TOWNS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POLL_TYPES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'POSITIONS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'STATES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'THEMES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'TOWNS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'VOTES')
				await storeDriver.dropTable('votecube_com__ecclesia', 'VOTE_FACTORS')
				await storeDriver.dropTable('votecube_com__ecclesia', 'VOTE_FACTOR_TYPES')
		*/

		const server = await container(this).get(TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();

		const hydrate = await storeDriver.doesTableExist('air___airport__territory',
			'PACKAGES', context);

		await this.installStarterSchema(false, hydrate, context);

		if (!hydrate) {
			const internalRecordManager = await container(this)
				.get(INTERNAL_RECORD_MANAGER)
			await internalRecordManager.initTerminal(domainName, context)
		}

		(server as any).tempActor = null;
		this.initialized = true;
	}

	isInitialized(): boolean {
		return this.initialized;
	}

	async initFeatureSchemas(
		context: IContext,
		jsonSchemas?: JsonSchemaWithLastIds[]
	): Promise<void> {
		const schemaDao = await container(this).get(SCHEMA_DAO);

		const schemas = await schemaDao.findAll()
		const existingSchemaMap: Map<string, ISchema> = new Map()
		for (const schema of schemas) {
			existingSchemaMap.set(schema.name, schema)
		}

		// const candidateSchemaDomainNames: DomainName[] = []
		// const candidateSchemaNames: SchemaName[] = []
		// for (const jsonSchema of jsonSchemas) {
		// 	 candidateSchemaDomainNames.push(jsonSchema.domain)
		// 	 candidateSchemaNames.push(getSchemaName(jsonSchema))
		// }
		// FIXME: this search should be done by schema signature
		// const maxVersionedMapBySchemaAndDomainNames = await schemaDao.findMaxVersionedMapBySchemaAndDomainNames(
		// 	candidateSchemaDomainNames, candidateSchemaNames)
		// const lastIdsByDomainAndSchemaNames = new Map()

		// const schemaNames: SchemaName[] = [];
		// for (const jsonSchema of jsonSchemas) {
		// 	const schemaName = getSchemaName(jsonSchema)
		// FIXME: right now Non-Entity Tree queries don't work, fix them and figure out
		// what needs to be done here
		// const schemaMapForDomain = maxVersionedMapBySchemaAndDomainNames.get(jsonSchema.domain)
		// if (!schemaMapForDomain) {
		// 	schemaNames.push(schemaName)
		// } else {
		// 	const schemaLookupRecord = schemaMapForDomain.get(schemaName)
		// 	if (schemaLookupRecord) {

		// 	} else {
		// schemaNames.push(schemaName)
		// }
		// }
		// }

		const schemasToCreate: JsonSchemaWithLastIds[] = []
		for (const jsonSchema of jsonSchemas) {
			const existingSchema = existingSchemaMap.get(getSchemaName(jsonSchema))
			if (existingSchema) {
				jsonSchema.lastIds = existingSchema.jsonSchema.lastIds
			} else {
				schemasToCreate.push(jsonSchema)
			}
		}

		// if (schemasToCreate.length) {
		const [schemaInitializer, server] = await container(this)
			.get(SCHEMA_INITIALIZER, TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();
		// await schemaInitializer.initialize(schemasToCreate, context, existingSchemasAreHydrated);
		await schemaInitializer.initialize(schemasToCreate, context, true);
		// }

		(server as any).tempActor = null;
	}

	/*
	static async addDataStore(
		storeType: StoreType,
		terminalName: string
	): Promise<void> {
		if (this.isInitialized(terminalName)) {
			throw new Error(
			`Database '${terminalName}' is already initialized`);
		}
		const newDataStore = await QDataStore.db(dbConst.DEFAULT_DB).save({
			name: terminalName,
			storeType: storeType
		});
		await TQ.init(storeType, terminalName);
	}

	private doEnsureInitialized(
		terminalName: string,
		resolve,
		reject,
		remainingTimeout: number
	): void {
		if (this.isInitialized(terminalName)) {
			resolve()
		}
		if (remainingTimeout <= 0) {
			reject(`Timeout out waiting for initialization of DB: [${terminalName}]`)
		}
		remainingTimeout -= 100
		setTimeout(() => {
			this.doEnsureInitialized(terminalName, resolve, reject, remainingTimeout)
		}, 100)
	}
	*/

	private async installStarterSchema(
		stage: boolean,
		hydrate: boolean,
		context: IContext,
	) {
		const blueprintFile = await import('@airport/blueprint');
		const schemaInitializer = await container(this).get(SCHEMA_INITIALIZER);
		if (stage) {
			await schemaInitializer.stage(blueprintFile.BLUEPRINT as any, context);
		} else if (hydrate) {
			await schemaInitializer.hydrate(blueprintFile.BLUEPRINT as any, context);
			// Below appears to be not needed - hydrate gets all schemas
			// const schemaDao = await container(this).get(SCHEMA_DAO)
			// const schemas = await schemaDao.findAll()
			// const jsonSchemaNameSet: Set<string> = new Set()
			// blueprintFile.BLUEPRINT
			// 	.map(jsonSchema => getSchemaName(jsonSchema))
			// 	// schemname contains both domain and schema's actual name
			// 	.forEach(schemaName => {
			// 		jsonSchemaNameSet.add(schemaName)
			// 	})
			// const jsonSchemas = schemas.filter(schema => !jsonSchemaNameSet.has(schema.name))
			// 	.map(schema => schema.jsonSchema)
			// await schemaInitializer.hydrate(jsonSchemas as any, context);
		} else {
			await schemaInitializer.initialize(blueprintFile.BLUEPRINT as any,
				context, false);
		}
	}
}

DI.set(DATABASE_MANAGER, DatabaseManager);
