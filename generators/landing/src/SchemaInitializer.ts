import {DI}              from '@airport/di'
import {JsonSchema}      from '@airport/ground-control'
import {
	DdlObjects,
	IQueryObjectInitializer,
	QUERY_OBJECT_INITIALIZER
}                        from '@airport/takeoff'
import {
	ITerminalStore,
	TERMINAL_STORE
}                        from '@airport/terminal-map'
import {ISchemaBuilder}  from './builder/ISchemaBuilder'
import {ISchemaChecker}  from './checker/SchemaChecker'
import {
	SCHEMA_BUILDER,
	SCHEMA_CHECKER,
	SCHEMA_COMPOSER,
	SCHEMA_INITIALIZER,
	SCHEMA_LOCATOR,
	SCHEMA_RECORDER
}                        from './diTokens'
import {ISchemaLocator}  from './locator/SchemaLocator'
import {ISchemaComposer} from './recorder/SchemaComposer'
import {ISchemaRecorder} from './recorder/SchemaRecorder'

export interface ISchemaInitializer {

	initialize(
		jsonSchemas: JsonSchema[],
		normalOperation?: boolean
	): Promise<void>

}

export class SchemaInitializer
	implements ISchemaInitializer {

	private queryObjectInitializer: Promise<IQueryObjectInitializer>
	private schemaBuilder: Promise<ISchemaBuilder>
	private schemaChecker: Promise<ISchemaChecker>
	private schemaComposer: Promise<ISchemaComposer>
	private schemaLocator: Promise<ISchemaLocator>
	private schemaRecorder: Promise<ISchemaRecorder>
	private terminalStore: Promise<ITerminalStore>

	constructor() {
		this.queryObjectInitializer = DI.getP(QUERY_OBJECT_INITIALIZER)
		this.schemaBuilder          = DI.getP(SCHEMA_BUILDER)
		this.schemaChecker          = DI.getP(SCHEMA_CHECKER)
		this.schemaComposer         = DI.getP(SCHEMA_COMPOSER)
		this.schemaLocator          = DI.getP(SCHEMA_LOCATOR)
		this.schemaRecorder         = DI.getP(SCHEMA_RECORDER)
		this.terminalStore          = DI.getP(TERMINAL_STORE)
	}

	async initialize(
		jsonSchemas: JsonSchema[],
		normalOperation: boolean = true
	): Promise<void> {
		const jsonSchemasToInstall: JsonSchema[] = []

		const schemaChecker = await this.schemaChecker
		const schemaLocator = await this.schemaLocator

		for (const jsonSchema of jsonSchemas) {
			await schemaChecker.check(jsonSchema)
			const existingSchema = schemaLocator.locateExistingSchemaVersionRecord(jsonSchema)

			if (existingSchema) {
				// Nothing needs to be done, we already have this schema version
				continue
			}
			jsonSchemasToInstall.push(jsonSchema)
		}

		let schemasWithValidDependencies

		if (normalOperation) {
			const schemaReferenceCheckResults = await schemaChecker
				.checkDependencies(jsonSchemasToInstall)

			if (schemaReferenceCheckResults.neededDependencies.length
				|| schemaReferenceCheckResults.schemasInNeedOfAdditionalDependencies.length) {
				throw new Error(`Installing schemas with external dependencies
			is not currently supported.`)
			}
			schemasWithValidDependencies = schemaReferenceCheckResults.schemasWithValidDependencies
		} else {
			schemasWithValidDependencies = jsonSchemasToInstall
		}

		for (const jsonSchema of schemasWithValidDependencies) {
			await (await this.schemaBuilder).build(jsonSchema)
		}

		const ddlObjects = (await this.schemaComposer).compose(
			schemasWithValidDependencies, !normalOperation)

		if (normalOperation) {
			await (await this.schemaRecorder).record(ddlObjects, normalOperation)
		}

		this.addNewSchemaVersionsToAll(ddlObjects);

		(await this.queryObjectInitializer).generateQObjectsAndPopulateStore(ddlObjects)


		if (!normalOperation) {
			await (await this.schemaRecorder).record(ddlObjects, normalOperation)
		}
	}

	addNewSchemaVersionsToAll(
		ddlObjects: DdlObjects
	) {
		for (const schemaVersion of ddlObjects.schemaVersions) {
			ddlObjects.allSchemaVersionsByIds[schemaVersion.id] = schemaVersion
		}
	}

}

DI.set(SCHEMA_INITIALIZER, SchemaInitializer)
