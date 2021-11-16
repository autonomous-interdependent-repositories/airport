import { container, DI } from '@airport/di';
import { DOMAIN_DAO } from '@airport/territory';
import { SCHEMA_COLUMN_DAO, SCHEMA_DAO, SCHEMA_ENTITY_DAO, SCHEMA_PROPERTY_COLUMN_DAO, SCHEMA_PROPERTY_DAO, SCHEMA_REFERENCE_DAO, SCHEMA_RELATION_COLUMN_DAO, SCHEMA_RELATION_DAO, SCHEMA_VERSION_DAO } from '@airport/traffic-pattern';
import { DDL_OBJECT_RETRIEVER } from './tokens';
export class DdlObjectRetriever {
    constructor() {
        this.lastIds = {
            columns: 0,
            domains: 0,
            entities: 0,
            properties: 0,
            propertyColumns: 0,
            relations: 0,
            relationColumns: 0,
            schemas: 0,
            schemaVersions: 0
        };
    }
    async retrieveDdlObjects() {
        const [domainDao, schemaDao, schemaVersionDao, schemaReferenceDao, schemaEntityDao, schemaPropertyDao, schemaRelationDao, schemaColumnDao, schemaPropertyColumnDao, schemaRelationColumnDao] = await container(this).get(DOMAIN_DAO, SCHEMA_DAO, SCHEMA_VERSION_DAO, SCHEMA_REFERENCE_DAO, SCHEMA_ENTITY_DAO, SCHEMA_PROPERTY_DAO, SCHEMA_RELATION_DAO, SCHEMA_COLUMN_DAO, SCHEMA_PROPERTY_COLUMN_DAO, SCHEMA_RELATION_COLUMN_DAO);
        const schemas = await schemaDao.findAllActive();
        const schemaIndexes = [];
        const domainIdSet = new Set();
        schemas.forEach(schema => {
            schemaIndexes.push(schema.index);
            domainIdSet.add(schema.domain.id);
        });
        schemas.sort((schema1, schema2) => {
            return schema1.index - schema2.index;
        });
        const domains = await domainDao.findByIdIn(Array.from(domainIdSet));
        const allSchemaVersions = await schemaVersionDao
            .findAllActiveOrderBySchemaIndexAndId();
        let lastSchemaIndex;
        // const allSchemaVersionsByIds: ISchemaVersion[] = []
        const latestSchemaVersions = [];
        const schemaVersions = [];
        for (const schemaVersion of allSchemaVersions) {
            if (schemaVersion.schema.index !== lastSchemaIndex) {
                latestSchemaVersions.push(schemaVersion);
            }
            // allSchemaVersionsByIds[schemaVersion.id] = schemaVersion
            lastSchemaIndex = schemaVersion.schema.index;
            schemaVersions.push(schemaVersion);
        }
        const latestSchemaVersionIds = latestSchemaVersions.map(schemaVersion => schemaVersion.id);
        const schemaReferences = await schemaReferenceDao
            .findAllForSchemaVersions(latestSchemaVersionIds);
        const entities = await schemaEntityDao
            .findAllForSchemaVersions(latestSchemaVersionIds);
        const entityIds = entities.map(entity => entity.id);
        /*
        const entityIds = entities.map(
    entity => {
        if (entity.tableConfig) {
            entity.tableConfig = JSON.parse(entity.tableConfig as any)
        }
        return entity.id
    })
         */
        const properties = await schemaPropertyDao
            .findAllForEntities(entityIds);
        const propertyIds = properties.map(property => property.id);
        const relations = await schemaRelationDao
            .findAllForProperties(propertyIds);
        const columns = await schemaColumnDao
            .findAllForEntities(entityIds);
        const columnIds = columns.map(column => column.id);
        const propertyColumns = await schemaPropertyColumnDao
            .findAllForColumns(columnIds);
        const relationColumns = await schemaRelationColumnDao
            .findAllForColumns(columnIds);
        this.lastIds = {
            columns: columns.length,
            domains: domains.length,
            entities: entities.length,
            properties: properties.length,
            propertyColumns: propertyColumns.length,
            relationColumns: relationColumns.length,
            relations: relations.length,
            schemas: schemas.length,
            schemaVersions: schemaVersions.length,
        };
        return {
            // allDomains: domains,
            // allSchemas: schemas,
            // allSchemaVersionsByIds,
            columns,
            domains,
            entities,
            latestSchemaVersions,
            properties,
            propertyColumns,
            relationColumns,
            relations,
            schemaReferences,
            schemas,
            schemaVersions
        };
    }
}
DI.set(DDL_OBJECT_RETRIEVER, DdlObjectRetriever);
//# sourceMappingURL=DdlObjectRetriever.js.map