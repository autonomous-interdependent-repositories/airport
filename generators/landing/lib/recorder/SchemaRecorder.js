import { AIR_DB } from '@airport/air-control';
import { container, DI } from '@airport/di';
import { DOMAIN_DAO } from '@airport/territory';
import { transactional } from '@airport/tower';
import { SCHEMA_COLUMN_DAO, SCHEMA_DAO, SCHEMA_ENTITY_DAO, SCHEMA_PROPERTY_COLUMN_DAO, SCHEMA_PROPERTY_DAO, SCHEMA_REFERENCE_DAO, SCHEMA_RELATION_COLUMN_DAO, SCHEMA_RELATION_DAO, SCHEMA_VERSION_DAO } from '@airport/traffic-pattern';
import { SCHEMA_RECORDER } from '../tokens';
export class SchemaRecorder {
    async record(ddlObjects, normalOperation) {
        const [airDb, domainDao, schemaColumnDao, schemaDao, schemaEntityDao, schemaPropertyColumnDao, schemaPropertyDao, schemaReferenceDao, schemaRelationColumnDao, schemaRelationDao, schemaVersionDao] = await container(this)
            .get(AIR_DB, DOMAIN_DAO, SCHEMA_COLUMN_DAO, SCHEMA_DAO, SCHEMA_ENTITY_DAO, SCHEMA_PROPERTY_COLUMN_DAO, SCHEMA_PROPERTY_DAO, SCHEMA_REFERENCE_DAO, SCHEMA_RELATION_COLUMN_DAO, SCHEMA_RELATION_DAO, SCHEMA_VERSION_DAO);
        await transactional(async () => {
            // FIXME: add support for real schema versioning
            this.setDefaultVersioning(ddlObjects);
            if (normalOperation) {
                await this.normalRecord(ddlObjects, domainDao, schemaDao, schemaVersionDao, schemaReferenceDao, schemaEntityDao, schemaPropertyDao, schemaRelationDao, schemaColumnDao, schemaPropertyColumnDao, schemaRelationColumnDao);
            }
            else {
                await this.bootstrapRecord(airDb, ddlObjects, domainDao, schemaDao, schemaVersionDao, schemaReferenceDao, schemaEntityDao, schemaPropertyDao, schemaRelationDao, schemaColumnDao, schemaPropertyColumnDao, schemaRelationColumnDao);
            }
        });
    }
    async normalRecord(ddlObjects, domainDao, schemaDao, schemaVersionDao, schemaReferenceDao, schemaEntityDao, schemaPropertyDao, schemaRelationDao, schemaColumnDao, schemaPropertyColumnDao, schemaRelationColumnDao) {
        await domainDao.bulkCreate(ddlObjects.domains, false);
        await schemaDao.bulkCreate(ddlObjects.schemas, false);
        await schemaVersionDao.bulkCreate(ddlObjects.schemaVersions, false);
        await schemaReferenceDao.bulkCreate(ddlObjects.schemaReferences, false);
        await schemaEntityDao.bulkCreate(ddlObjects.entities, false);
        await schemaPropertyDao.bulkCreate(ddlObjects.properties, false);
        await schemaRelationDao.bulkCreate(ddlObjects.relations, false);
        await schemaColumnDao.bulkCreate(ddlObjects.columns, false);
        await schemaPropertyColumnDao.bulkCreate(ddlObjects.propertyColumns, false);
        await schemaRelationColumnDao.bulkCreate(ddlObjects.relationColumns, false);
    }
    setDefaultVersioning(ddlObjects) {
        for (const schemaReference of ddlObjects.schemaReferences) {
            schemaReference.deprecatedSinceVersion = null;
            schemaReference.removedInVersion = null;
            schemaReference.sinceVersion = schemaReference.ownSchemaVersion;
        }
        for (const entity of ddlObjects.entities) {
            entity.deprecatedSinceVersion = null;
            entity.removedInVersion = null;
            entity.sinceVersion = entity.schemaVersion;
        }
        for (const property of ddlObjects.properties) {
            property.deprecatedSinceVersion = null;
            property.removedInVersion = null;
            property.sinceVersion = property.entity.schemaVersion;
        }
        for (const relation of ddlObjects.relations) {
            relation.deprecatedSinceVersion = null;
            relation.removedInVersion = null;
            relation.sinceVersion = relation.entity.schemaVersion;
        }
        for (const column of ddlObjects.columns) {
            column.deprecatedSinceVersion = null;
            column.removedInVersion = null;
            column.sinceVersion = column.entity.schemaVersion;
        }
        for (const propertyColumn of ddlObjects.propertyColumns) {
            propertyColumn.deprecatedSinceVersion = null;
            propertyColumn.removedInVersion = null;
            propertyColumn.sinceVersion = propertyColumn.property.entity.schemaVersion;
        }
        for (const relationColumn of ddlObjects.relationColumns) {
            relationColumn.deprecatedSinceVersion = null;
            relationColumn.removedInVersion = null;
            relationColumn.sinceVersion = relationColumn.parentRelation.entity.schemaVersion;
        }
    }
    async bootstrapRecord(airDb, ddlObjects, domainDao, schemaDao, schemaVersionDao, schemaReferenceDao, schemaEntityDao, schemaPropertyDao, schemaRelationDao, schemaColumnDao, schemaPropertyColumnDao, schemaRelationColumnDao) {
        await this.bulkCreate(airDb, domainDao, ddlObjects.domains);
        await this.bulkCreate(airDb, schemaDao, ddlObjects.schemas);
        await this.bulkCreate(airDb, schemaVersionDao, ddlObjects.latestSchemaVersions);
        await this.bulkCreate(airDb, schemaReferenceDao, ddlObjects.schemaReferences);
        await this.bulkCreate(airDb, schemaEntityDao, ddlObjects.entities);
        await this.bulkCreate(airDb, schemaPropertyDao, ddlObjects.properties);
        await this.bulkCreate(airDb, schemaRelationDao, ddlObjects.relations);
        await this.bulkCreate(airDb, schemaColumnDao, ddlObjects.columns);
        await this.bulkCreate(airDb, schemaPropertyColumnDao, ddlObjects.propertyColumns);
        await this.bulkCreate(airDb, schemaRelationColumnDao, ddlObjects.relationColumns);
    }
    async bulkCreate(airDb, dao, entities) {
        await airDb.bulkCreate(entities, false, {
            dbEntity: dao.db.dbEntity
        }, 'SchemaRecorder.bulkCreate', false);
    }
}
DI.set(SCHEMA_RECORDER, SchemaRecorder);
//# sourceMappingURL=SchemaRecorder.js.map