import {
	IUtils,
	UtilsToken
}                                    from '@airport/air-control'
import {
	DomainId,
	EntityId,
	ISchemaUtils,
	PropertyId,
	SchemaIndex,
	SchemaUtilsToken,
	SchemaVersionId
} from '@airport/ground-control'
import {
	DomainDaoToken,
	IDomain,
	IDomainDao
}                                    from '@airport/territory'
import {
	ISchema,
	ISchemaColumn,
	ISchemaColumnDao,
	ISchemaDao,
	ISchemaEntity,
	ISchemaEntityDao,
	ISchemaProperty,
	ISchemaPropertyColumn,
	ISchemaPropertyColumnDao,
	ISchemaPropertyDao,
	ISchemaReference,
	ISchemaReferenceDao,
	ISchemaRelation,
	ISchemaRelationColumn,
	ISchemaRelationColumnDao,
	ISchemaRelationDao,
	ISchemaVersion,
	ISchemaVersionDao,
	SchemaColumnDaoToken,
	SchemaDaoToken,
	SchemaEntityDaoToken,
	SchemaPropertyColumnDaoToken,
	SchemaPropertyDaoToken,
	SchemaReferenceDaoToken,
	SchemaRelationColumnDaoToken,
	SchemaRelationDaoToken,
	SchemaVersionDaoToken
}                                    from '@airport/traffic-pattern'
import {
	Inject,
	Service
}                                    from 'typedi'
import {QueryObjectInitializerToken} from './InjectionTokens'

export interface IQueryObjectInitializer {

	initialize(): Promise<void>

}

interface RetrievedDllObjects {
	columns: ISchemaColumn[]
	domains: IDomain[]
	entities: ISchemaEntity[]
	latestSchemaVersions: ISchemaVersion[]
	properties: ISchemaProperty[]
	propertyColumns: ISchemaPropertyColumn[]
	relationColumns: ISchemaRelationColumn[]
	relations: ISchemaRelation[]
	schemaReferences: ISchemaReference[]
	schemas: ISchema[]
}

@Service(QueryObjectInitializerToken)
export class QueryObjectInitializer
	implements IQueryObjectInitializer {

	constructor(
		// @Inject(AirportDatabaseToken)
		// private airportDatabase: IAirportDatabase,
		@Inject(DomainDaoToken)
		private domainDao: IDomainDao,
		@Inject(SchemaColumnDaoToken)
		private schemaColumnDao: ISchemaColumnDao,
		@Inject(SchemaDaoToken)
		private schemaDao: ISchemaDao,
		@Inject(SchemaEntityDaoToken)
		private schemaEntityDao: ISchemaEntityDao,
		@Inject(SchemaPropertyColumnDaoToken)
		private schemaPropertyColumnDao: ISchemaPropertyColumnDao,
		@Inject(SchemaPropertyDaoToken)
		private schemaPropertyDao: ISchemaPropertyDao,
		@Inject(SchemaReferenceDaoToken)
		private schemaReferenceDao: ISchemaReferenceDao,
		@Inject(SchemaRelationColumnDaoToken)
		private schemaRelationColumnDao: ISchemaRelationColumnDao,
		@Inject(SchemaRelationDaoToken)
		private schemaRelationDao: ISchemaRelationDao,
		@Inject(SchemaUtilsToken)
		private schemaUtils: ISchemaUtils,
		@Inject(SchemaVersionDaoToken)
		private schemaVersionDao: ISchemaVersionDao,
		@Inject(UtilsToken)
		private utils: IUtils
	) {
	}


	async initialize(): Promise<void> {
		const retrievedDdlObjects = await this.retrieveDdlObjects()

		const schemaVersionMapById = this.linkDomainsAndSchemasAndVersions(
			retrievedDdlObjects.domains,
			retrievedDdlObjects.schemas,
			retrievedDdlObjects.latestSchemaVersions
		)

		const entityMapById = this.linkEntities(
			schemaVersionMapById, retrievedDdlObjects.entities)


	}

	async retrieveDdlObjects()
		: Promise<RetrievedDllObjects> {
		const schemas                      = await this.schemaDao
			.findAllActive()
		const schemaIndexes: SchemaIndex[] = []
		const domainIdSet: Set<DomainId>   = new Set()
		schemas.forEach(
			schema => {
				schemaIndexes.push(schema.index)
				domainIdSet.add(schema.domain.id)
			})

		const domains = await this.domainDao
			.findByIdIn(Array.from(domainIdSet))

		const latestSchemaVersions   = await this.schemaVersionDao
			.findAllLatestForSchemaIndexes(schemaIndexes)
		const latestSchemaVersionIds = latestSchemaVersions.map(
			schemaVersion => schemaVersion.id)

		const schemaReferences = await this.schemaReferenceDao
			.findAllForSchemaVersions(latestSchemaVersionIds)

		const entities  = await this.schemaEntityDao
			.findAllForSchemaVersions(latestSchemaVersionIds)
		const entityIds = entities.map(
			entity => entity.id)

		const properties  = await this.schemaPropertyDao
			.findAllForEntities(entityIds)
		const propertyIds = properties.map(
			property => property.id)

		const relations = await this.schemaRelationDao
			.findAllForProperties(propertyIds)

		const columns   = await this.schemaColumnDao
			.findAllForEntities(entityIds)
		const columnIds = columns.map(
			column => column.id)

		const propertyColumns = await this.schemaPropertyColumnDao
			.findAllForColumns(columnIds)

		const relationColumns = await this.schemaRelationColumnDao
			.findAllForColumns(columnIds)

		return {
			columns,
			domains,
			entities,
			latestSchemaVersions,
			properties,
			propertyColumns,
			relationColumns,
			relations,
			schemaReferences,
			schemas
		}
	}

	linkDomainsAndSchemasAndVersions(
		domains: IDomain[],
		schemas: ISchema[],
		latestSchemaVersions: ISchemaVersion[]
	): Map<SchemaVersionId, ISchemaVersion> {
		const domainMapById: Map<DomainId, IDomain> = new Map()
		domains.forEach((
			domain: IDomain
		) => {
			domainMapById.set(domain.id, domain)
			domain.schemas = []
		})

		const schemaMapByIndex: Map<SchemaIndex, ISchema> = new Map()
		schemas.forEach((
			schema: ISchema
		) => {
			schemaMapByIndex.set(schema.index, schema)
			const domain  = domainMapById.get(schema.domain.id)
			schema.domain = domain
			domain.schemas.push(<any>schema)
		})

		const schemaVersionMapById: Map<SchemaVersionId, ISchemaVersion> = new Map()
		latestSchemaVersions.forEach((
			schemaVersion: ISchemaVersion
		) => {
			schemaVersionMapById.set(schemaVersion.id, schemaVersion)

			const schema          = schemaMapByIndex.get(schemaVersion.schema.index)
			schema.currentVersion = schemaVersion
			schema.versions       = [schemaVersion]

			schemaVersion.schema                = schema
			schemaVersion.entities              = []
			schemaVersion.references            = []
			schemaVersion.referencedBy          = []
			schemaVersion.entityMapByName       = {}
			schemaVersion.referencesMapByName   = {}
			schemaVersion.referencedByMapByName = {}
		})

		return schemaVersionMapById
	}

	private linkEntities(
		schemaVersionMapById: Map<SchemaVersionId, ISchemaVersion>,
		entities: ISchemaEntity[]
	): Map<EntityId, ISchemaEntity> {
		const entityMapById: Map<EntityId, ISchemaEntity> = new Map()

		entities.forEach((
			entity: ISchemaEntity
		) => {
			const schemaVersion = schemaVersionMapById.get(entity.schemaVersion.id)
			entity.schemaVersion = schemaVersion
			schemaVersion.entities[entity.index] = entity

			entity.columns = []
			entity.properties = []
			entity.relations = []
			entity.relationReferences = []
			entity.columnMap = {}
			entity.idColumns = []
			entity.idColumnMap = {}
			entity.propertyMap = {}

			entityMapById.set(entity.id, entity)
		})

		return entityMapById
	}

	private linkPropertiesAndRelations(
		entityMapById: Map<EntityId, ISchemaEntity>,
		properties: ISchemaProperty[],
		relations: ISchemaRelation[]
	) {
		const propertyMapById: Map<PropertyId, ISchemaProperty> = new Map()

		properties.forEach((
			property: ISchemaProperty
		) => {
			const entity = entityMapById.get(property.entity.id)
			entity.properties[property.index] = property
			entity.propertyMap[property.name] = property

			property.entity = entity

			property.propertyColumns = []

			propertyMapById.set(property.id, property)
		})

		relations.forEach((
			relation: ISchemaRelation
		) => {
			const entity = entityMapById.get(relation.entity.id)
			entity.relations[relation.index] = relation

			relation.entity = entity
			relation.manyRelationColumns = []
			relation.oneRelationColumns = []
			relation
		})
	}

}
