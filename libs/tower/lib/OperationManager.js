import { and, Delete, InsertColumnValues, InsertValues, isStub, QUERY_FACADE, UpdateProperties, valuesEqual } from '@airport/air-control';
import { container } from '@airport/di';
import { CascadeOverwrite, CascadeType, CRUDOperation, ensureChildArray, ensureChildMap, EntityRelationType, SQLDataType } from '@airport/ground-control';
import { TRANS_SERVER } from './tokens';
export class OperationManager {
    // higherOrderOpsYieldLength: number = 100
    // transactionInProgress: boolean    = false
    throwUnexpectedProperty(dbProperty, dbColumn, value) {
        throw new Error(`Unexpected property value '${value.toString()}' in property '${dbProperty.entity.name}.${dbProperty.name}'
		(column: '${dbColumn.name}').`);
    }
    warn(message) {
        console.log(message);
    }
    /**
     * Transactional context must have been started by the time this method is called.
     *
     * @param qEntity
     * @param entity
     */
    async performCreate(createdEntityMap, transaction, ctx, idData) {
        // TODO: add code to populate CREATED_AT (and save for update in performUpdate)
        // also add code populate user info (USER_ACCOUNT_ID for now, eventually the actor)
        const lastCheckIfProcessed = ctx.checkIfProcessed;
        ctx.checkIfProcessed = !idData;
        let result = await this.internalCreate(createdEntityMap, transaction, ctx, !idData);
        await this.cascadeOnPersist(result.cascadeRecords, ctx.dbEntity, createdEntityMap, transaction, ctx);
        ctx.checkIfProcessed = lastCheckIfProcessed;
        return result.numberOfAffectedRecords;
    }
    /**
     * Transactional context must have been started by the time this method is called.
     *
     * @param qEntity
     * @param entity
     */
    async performBulkCreate(createdEntityMap, transaction, ctx, ensureGeneratedValues = true // For internal use only
    ) {
        let result = await this.internalCreate(createdEntityMap, transaction, ctx, ensureGeneratedValues);
        await this.cascadeOnPersist(result.cascadeRecords, ctx.dbEntity, createdEntityMap, transaction, ctx);
        return result.numberOfAffectedRecords;
    }
    async internalInsertColumnValues(dbEntity, rawInsertColumnValues, queryUtils, fieldUtils, transaction) {
        const [transactionalServer, queryFacade] = await container(this).get(TRANS_SERVER, QUERY_FACADE);
        const insertColumnValues = new InsertColumnValues(rawInsertColumnValues);
        const portableQuery = queryFacade.getPortableQuery(dbEntity, insertColumnValues, null, queryUtils, fieldUtils);
        return await transactionalServer.insertValues(portableQuery, transaction);
    }
    async internalInsertValues(rawInsertValues, transaction, ctx, ensureGeneratedValues) {
        const [transactionalServer, queryFacade] = await container(this).get(TRANS_SERVER, QUERY_FACADE);
        const insertValues = new InsertValues(rawInsertValues);
        const portableQuery = queryFacade.getPortableQuery(ctx.dbEntity, insertValues, null, ctx.ioc.queryUtils, ctx.ioc.fieldUtils);
        return await transactionalServer.insertValues(portableQuery, transaction, ensureGeneratedValues);
    }
    async internalInsertColumnValuesGenerateIds(dbEntity, rawInsertColumnValues, queryUtils, fieldUtils, transaction) {
        const [transactionalServer, queryFacade] = await container(this).get(TRANS_SERVER, QUERY_FACADE);
        const insertValues = new InsertColumnValues(rawInsertColumnValues);
        const portableQuery = queryFacade.getPortableQuery(dbEntity, insertValues, null, queryUtils, fieldUtils);
        return await transactionalServer.insertValuesGetIds(portableQuery, transaction);
    }
    /**
     * Transactional context must have been started by the time this method is called.
     *
     * @param qEntity
     * @param entity
     */
    async performUpdate(updatedEntityMap, transaction, ctx, originalValue) {
        if (!originalValue) {
            let [isProcessed, entityIdData] = this.isProcessed(ctx.entities[0], updatedEntityMap, ctx.dbEntity, ctx.ioc.schemaUtils);
            if (isProcessed === true) {
                return 0;
            }
            if (!entityIdData.idKey) {
                throw new Error(`Cannot update ${ctx.dbEntity.name}, not all @Id(s) are set.`);
            }
            originalValue = await this.getOriginalRecord(ctx.dbEntity, entityIdData.idKey, ctx.ioc.updateCache);
            // if (!originalValue) {
            // 	throw new Error(`Cannot update ${dbEntity.name}, entity not found.`)
            // }
        }
        let result = await this.internalUpdate(originalValue, transaction, ctx);
        await this.cascadeOnPersist(result.cascadeRecords, ctx.dbEntity, updatedEntityMap, transaction, ctx);
        return result.numberOfAffectedRecords;
    }
    async internalInsertValuesGetIds(rawInsertValues, transaction, ctx) {
        const insertValues = new InsertValues(rawInsertValues);
        const portableQuery = ctx.ioc.queryFacade.getPortableQuery(ctx.dbEntity, insertValues, null, ctx.ioc.queryUtils, ctx.ioc.fieldUtils);
        return await ctx.ioc.transactionalServer.insertValuesGetIds(portableQuery, transaction);
    }
    /*
    protected abstract async getOriginalValues(
        entitiesToUpdate: UpdateRecord[],
        dbEntity: DbEntity,
        airDb: IAirportDatabase,
        fieldUtils: IFieldUtils,
        queryFacade: IQueryFacade,
        queryUtils: IQueryUtils,
        schemaUtils: ISchemaUtils,
        transactionalServer: ITransactionalServer,
        updateCache: IUpdateCache
    ): Promise<MappedEntityArray<any>>;
*/
    /*
    protected getIdsWhereClause(
        entitiesToUpdate: UpdateRecord[],
        qEntity: IQEntity
    ): JSONBaseOperation {
        let idsWhereClause: JSONBaseOperation
        if (entitiesToUpdate[0].idData.idColumnValueData.length > 1) {
            let idsWhereClauseFragments = entitiesToUpdate.map((entityToUpdate) => {
                let singleIdWhereClauseFragments: JSONValueOperation[] = entityToUpdate.idData.idColumnValueData.map((
                    referencedData: {
                        idColumn: DbColumn,
                        idValue: number | string,
                        propertyNameChains: string[][],
                    }) => {
                    let currentQObject: any = qEntity
                    for (const propertyName of referencedData.propertyNameChains[0]) {
                        currentQObject = currentQObject[propertyName]
                    }
                    return currentQObject.equals(referencedData.idValue)
                })
                return and(...singleIdWhereClauseFragments)
            })
            if (entitiesToUpdate.length > 1) {
                idsWhereClause = or(...idsWhereClauseFragments)
            } else {
                return idsWhereClauseFragments[0]
            }
        } else {
            let idsWhereClauseFragments = entitiesToUpdate.map((entityToUpdate) => {
                return entityToUpdate.idData.idColumnValueData[0].idValue
            })
            let currentQObject: any     = qEntity
            for (const propertyName of entitiesToUpdate[0].idData.idColumnValueData[0].propertyNameChains[0]) {
                currentQObject = currentQObject[propertyName]
            }
            if (entitiesToUpdate.length > 1) {
                idsWhereClause = currentQObject.in(idsWhereClauseFragments)
            } else {
                idsWhereClause = currentQObject.equals(idsWhereClauseFragments[0])
            }
        }

        return idsWhereClause
    }
*/
    async internalUpdateColumnsWhere(updateColumns, transaction, ctx) {
        const portableQuery = ctx.ioc.queryFacade.getPortableQuery(ctx.dbEntity, updateColumns, null, ctx.ioc.queryUtils, ctx.ioc.fieldUtils);
        return await ctx.ioc.transactionalServer.updateValues(portableQuery, transaction);
    }
    async internalUpdateWhere(update, transaction, ctx) {
        const portableQuery = ctx.ioc.queryFacade.getPortableQuery(ctx.dbEntity, update, null, ctx.ioc.queryUtils, ctx.ioc.fieldUtils);
        return await ctx.ioc.transactionalServer.updateValues(portableQuery, transaction);
    }
    /**
     * Transactional context must have been started by the time this method is called.
     * @param qEntity
     * @param entity
     */
    async performDelete(transaction, ctx) {
        return await this.internalDelete(transaction, ctx);
        // Delete cascading is done on the server - there is no new information
        // to pull for this from the client
    }
    async internalDeleteWhere(aDelete, transaction, ctx) {
        let portableQuery = ctx.ioc.queryFacade.getPortableQuery(ctx.dbEntity, aDelete, null, ctx.ioc.queryUtils, ctx.ioc.fieldUtils);
        return await ctx.ioc.transactionalServer.deleteWhere(portableQuery, transaction);
    }
    async internalCreate(createdEntityMap, transaction, ctx, ensureGeneratedValues) {
        const qEntity = ctx.ioc.airDb.qSchemas[ctx.dbEntity.schemaVersion.schema.index][ctx.dbEntity.name];
        let rawInsert = {
            insertInto: qEntity,
            columns: ctx.ioc.metadataUtils.getAllNonGeneratedColumns(qEntity),
            values: []
        };
        let columnIndexesInValues = [];
        rawInsert.columns.forEach((qField, index) => {
            columnIndexesInValues[qField.dbColumn.index] = index;
        });
        let cascadeRecords = [];
        for (const entity of ctx.entities) {
            if (ctx.checkIfProcessed && this.isProcessed(entity, createdEntityMap, ctx.dbEntity, ctx.ioc.schemaUtils)[0] === true) {
                continue;
            }
            let foundValues = [];
            let valuesFragment = [];
            for (const dbProperty of ctx.dbEntity.properties) {
                let newValue = entity[dbProperty.name];
                if (newValue === undefined) {
                    newValue = null;
                }
                if (dbProperty.relation && dbProperty.relation.length) {
                    const dbRelation = dbProperty.relation[0];
                    this.assertRelationValueIsAnObject(newValue, dbProperty);
                    switch (dbRelation.relationType) {
                        case EntityRelationType.MANY_TO_ONE:
                            this.assertManyToOneNotArray(newValue);
                            ctx.ioc.schemaUtils.forEachColumnOfRelation(dbRelation, entity, (dbColumn, columnValue, propertyNameChains) => {
                                if (dbProperty.isId) {
                                    if (ctx.ioc.schemaUtils.isIdEmpty(columnValue)) {
                                        throw new Error(`non-@GeneratedValue() @Id() ${ctx.dbEntity.name}.${dbProperty.name} 
											must have a value for 'create' operations.`);
                                    }
                                }
                                if (ctx.ioc.schemaUtils.isRepositoryId(dbColumn.name)) {
                                    if (ctx.ioc.schemaUtils.isEmpty(columnValue)) {
                                        throw new Error(`Repository Id must be specified on an insert`);
                                    }
                                }
                                this.columnProcessed(dbProperty, foundValues, dbColumn, columnValue);
                                if (dbColumn.isGenerated && dbProperty.isId && columnValue < 0) {
                                    // Do not insert negative integers for temporary identification
                                    // within the circular dependency management lookup
                                    return;
                                }
                                valuesFragment[columnIndexesInValues[dbColumn.index]]
                                    = columnValue === undefined ? null : columnValue;
                            }, false);
                            // Cascading on manyToOne is not currently implemented, nothing else needs
                            // to be done
                            continue;
                        case EntityRelationType.ONE_TO_MANY:
                            this.checkCascade(newValue, ctx.cascadeOverwrite, dbProperty, dbRelation, ctx.ioc.schemaUtils, CRUDOperation.CREATE, cascadeRecords);
                            break;
                    }
                }
                else {
                    let column = dbProperty.propertyColumns[0].column;
                    this.ensureNonRelationalValue(dbProperty, column, newValue);
                    if (ctx.ioc.schemaUtils.isRepositoryId(column.name)
                        && ctx.ioc.schemaUtils.isEmpty(newValue)) {
                        throw new Error(`Repository Id must be specified on an insert`);
                    }
                    let addValue = true;
                    if (column.isGenerated && (newValue !== undefined && newValue !== null)) {
                        // Allowing negative integers for temporary identification
                        // within the circular dependency management lookup
                        if (!dbProperty.isId || newValue >= 0) {
                            throw new Error(`@GeneratedValue() "${ctx.dbEntity.name}.${dbProperty.name}" 
							cannot have a value for 'create' operations.`);
                        }
                        addValue = false;
                    }
                    if (dbProperty.isId) {
                        if (!column.isGenerated && ctx.ioc.schemaUtils.isIdEmpty(newValue)) {
                            throw new Error(`non-@GeneratedValue() @Id() "${ctx.dbEntity.name}.${dbProperty.name}" 
							must have a value for 'create' operations.`);
                        }
                    }
                    if (addValue) {
                        this.columnProcessed(dbProperty, foundValues, column, newValue);
                        valuesFragment[columnIndexesInValues[column.index]] = newValue;
                    }
                }
            }
            rawInsert.values.push(valuesFragment);
        }
        let numberOfAffectedRecords = 0;
        if (rawInsert.values.length) {
            const generatedColumns = ctx.dbEntity.columns.filter(column => column.isGenerated);
            if (generatedColumns.length && ensureGeneratedValues) {
                const idsAndGeneratedValues = await this.internalInsertValuesGetIds(rawInsert, transaction, ctx);
                for (let i = 0; i < ctx.entities.length; i++) {
                    for (const generatedColumn of generatedColumns) {
                        // Return index for generated column values is: DbColumn.index
                        ctx.entities[i][generatedColumn.propertyColumns[0].property.name]
                            = idsAndGeneratedValues[i][generatedColumn.index];
                    }
                }
                numberOfAffectedRecords = idsAndGeneratedValues.length;
            }
            else {
                numberOfAffectedRecords = await this.internalInsertValues(rawInsert, transaction, ctx, ensureGeneratedValues);
            }
        }
        return {
            cascadeRecords,
            numberOfAffectedRecords,
        };
    }
    checkCascade(value, cascadeOverwrite, dbProperty, dbRelation, schemaUtils, crudOperation, cascadeRecords) {
        this.assertOneToManyIsArray(value);
        if (cascadeOverwrite instanceof Object) {
            if (!cascadeOverwrite[dbProperty.name]) {
                return false;
            }
        }
        else {
            switch (cascadeOverwrite) {
                case CascadeOverwrite.NEVER:
                    return false;
                // If no overwrite was provided
                case CascadeOverwrite.DEFAULT:
                    if (!schemaUtils.doCascade(dbRelation, crudOperation)) {
                        return false;
                    }
                    break;
            }
        }
        cascadeRecords.push({
            relation: dbRelation,
            manyEntities: value,
        });
        return true;
    }
    /*
     Values for the same column could be repeated in different places in the object graph.
     For example, if the same column is mapped to two different @ManyToOne relations.
     In this case, when persisting an entity we need to make sure that all values for the
     entity in question are being persisted.
     */
    columnProcessed(dbProperty, foundValues, dbColumn, value) {
        // if (value === undefined) {
        // 	throw new Error(`Values cannot be undefined, please use null.`);
        // }
        if (foundValues[dbColumn.index] === undefined) {
            foundValues[dbColumn.index] = value;
            return false;
        }
        if (!valuesEqual(foundValues[dbColumn.index], value)) {
            throw new Error(`Found value mismatch in '${dbProperty.entity.name}.${dbProperty.name}'
			(column: '${dbColumn.name}'): ${foundValues[dbColumn.index]} !== ${value}`);
        }
        return true;
    }
    async cascadeOnPersist(cascadeRecords, parentDbEntity, alreadyModifiedEntityMap, transaction, ctx) {
        if (!cascadeRecords.length
            || ctx.cascadeOverwrite === CascadeOverwrite.NEVER) {
            return;
        }
        const previousDbEntity = ctx.dbEntity;
        const previousEntities = ctx.entities;
        for (const cascadeRecord of cascadeRecords) {
            if (!cascadeRecord.relation.oneToManyElems) {
                continue;
            }
            switch (cascadeRecord.relation.oneToManyElems.cascade) {
                case CascadeType.ALL:
                case CascadeType.PERSIST:
                    break;
                // Do not cascade if its for REMOVE only
                default:
                    continue;
            }
            const entitiesWithIds = [];
            // const entitiesWithIdMap: { [idKey: string]: UpdateRecord } = {}
            const entitiesWithoutIds = [];
            const dbEntity = cascadeRecord.relation.relationEntity;
            ctx.dbEntity = dbEntity;
            if (cascadeRecord.manyEntities) {
                for (const manyEntity of cascadeRecord.manyEntities) {
                    const [isProcessed, entityIdData] = this.isProcessed(manyEntity, alreadyModifiedEntityMap, dbEntity, ctx.ioc.schemaUtils);
                    if (isProcessed === true) {
                        return;
                    }
                    const record = {
                        newValue: manyEntity,
                        originalValue: null,
                        idData: entityIdData
                    };
                    if (entityIdData.idKey) {
                        entitiesWithIds.push(record);
                        // entitiesWithIdMap[entityIdData.idKey] = record
                    }
                    else {
                        entitiesWithoutIds.push(record);
                    }
                }
            }
            if (entitiesWithIds.length) {
                // entitiesWithIds.map(entityWithId)
                // updateCache.getEntityUpdateCache()
                // const originalValues = await this.getOriginalValues(
                // 	entitiesWithIds, dbEntity, airDb, fieldUtils,
                // 	queryFacade, queryUtils, schemaUtils,
                // 	transactionalServer, updateCache)
                // for (const idKey in originalValues.dataMap) {
                // 	entitiesWithIdMap[idKey].originalValue = originalValues.dataMap[idKey]
                // }
                for (let i = 0; i < entitiesWithIds.length; i++) {
                    let entityToOperateOn = entitiesWithIds[i];
                    ctx.entities = [entityToOperateOn.newValue];
                    let originalValue = ctx.ioc.updateCache.getEntityUpdateCache(entityToOperateOn);
                    if (!originalValue) {
                        if (entityToOperateOn.idData.idColumnValueData.length == 1) {
                            // Entity with a single Id always has the @Id generated
                            // hence, it must have since been deleted, skip it
                            return;
                        }
                        // Don't know if the entity has been deleted or is a brand new one, create it
                        // TODO: figure out if the entity has been deleted and if it has, throw an
                        // exception?
                        await this.performCreate(alreadyModifiedEntityMap, transaction, ctx, entityToOperateOn.idData);
                    }
                    else {
                        ctx.entities = [entityToOperateOn.newValue];
                        await this.performUpdate(alreadyModifiedEntityMap, transaction, ctx, entityToOperateOn.originalValue);
                    }
                }
            }
            for (let i = 0; i < entitiesWithoutIds.length; i++) {
                let entityToCreate = entitiesWithoutIds[i];
                ctx.entities = [entityToCreate];
                await this.performCreate(alreadyModifiedEntityMap, transaction, ctx, entityToCreate.idData);
            }
        }
        ctx.dbEntity = previousDbEntity;
        ctx.entities = previousEntities;
    }
    /**
     * On an update operation, can a nested create contain an update?
     * Via:
     *  OneToMany:
     *    Yes, if the child entity is itself in the update cache
     *  ManyToOne:
     *    Cascades do not travel across ManyToOne
     */
    async internalUpdate(originalEntity, transaction, ctx) {
        const qEntity = ctx.ioc.airDb.qSchemas[ctx.dbEntity.schemaVersion.schema.index][ctx.dbEntity.name];
        const cascadeRecords = [];
        const setFragment = {};
        const idWhereFragments = [];
        let numUpdates = 0;
        const valuesMapByColumn = [];
        const entity = ctx.entities[0];
        for (const dbProperty of ctx.dbEntity.properties) {
            const updatedValue = entity[dbProperty.name];
            if (!dbProperty.relation || !dbProperty.relation.length) {
                const dbColumn = dbProperty.propertyColumns[0].column;
                this.ensureNonRelationalValue(dbProperty, dbColumn, updatedValue);
                if (this.columnProcessed(dbProperty, valuesMapByColumn, dbColumn, updatedValue)) {
                    continue;
                }
                const originalValue = originalEntity[dbColumn.name];
                if (dbProperty.isId) {
                    // For an id property, the value is guaranteed to be the same (and not empty) -
                    // cannot entity-update id fields
                    idWhereFragments.push(qEntity[dbProperty.name].equals(updatedValue));
                }
                else if (!valuesEqual(originalValue, updatedValue)) {
                    setFragment[dbColumn.name] = updatedValue;
                    numUpdates++;
                }
                continue;
            }
            // It's a relation property
            this.assertRelationValueIsAnObject(updatedValue, dbProperty);
            const dbRelation = dbProperty.relation[0];
            switch (dbRelation.relationType) {
                case EntityRelationType.MANY_TO_ONE:
                    this.assertManyToOneNotArray(updatedValue);
                    ctx.ioc.schemaUtils.forEachColumnOfRelation(dbRelation, entity, (dbColumn, value, propertyNameChains) => {
                        if (this.columnProcessed(dbProperty, valuesMapByColumn, dbColumn, value)) {
                            return;
                        }
                        let originalValue = originalEntity[dbColumn.name];
                        if (dbProperty.isId) {
                            let idQProperty = qEntity;
                            for (const propertyNameLink of propertyNameChains[0]) {
                                idQProperty = idQProperty[propertyNameLink];
                            }
                            // For an id property, the value is guaranteed to be the same (and not
                            // empty) - cannot entity-update id fields
                            idWhereFragments.push(idQProperty.equals(value));
                        }
                        else if (!valuesEqual(originalValue, value)) {
                            setFragment[dbColumn.name] = value;
                            numUpdates++;
                        }
                    }, dbProperty.isId);
                    // Cascading on manyToOne is not currently implemented, nothing else needs to
                    // be done
                    continue;
                case EntityRelationType.ONE_TO_MANY:
                    this.checkCascade(updatedValue, ctx.cascadeOverwrite, dbProperty, dbRelation, ctx.ioc.schemaUtils, CRUDOperation.UPDATE, cascadeRecords);
                    break;
            }
        }
        let numberOfAffectedRecords = 0;
        if (numUpdates) {
            let whereFragment;
            if (idWhereFragments.length > 1) {
                whereFragment = and(...idWhereFragments);
            }
            else {
                whereFragment = idWhereFragments[0];
            }
            let rawUpdate = {
                update: qEntity,
                set: setFragment,
                where: whereFragment
            };
            let update = new UpdateProperties(rawUpdate);
            numberOfAffectedRecords = await this.internalUpdateWhere(update, transaction, ctx);
        }
        return {
            recordChanged: !!numUpdates,
            numberOfAffectedRecords: numberOfAffectedRecords,
            cascadeRecords: cascadeRecords
        };
    }
    ensureNonRelationalValue(dbProperty, dbColumn, value) {
        if (value === undefined || value === null) {
            return;
        }
        switch (dbColumn.type) {
            case SQLDataType.ANY:
                break;
            case SQLDataType.BOOLEAN:
                if (typeof value !== 'boolean') {
                    this.throwUnexpectedProperty(dbProperty, dbColumn, value);
                }
                break;
            case SQLDataType.DATE:
                if (typeof value !== 'object' || !(value instanceof Date)) {
                    this.throwUnexpectedProperty(dbProperty, dbColumn, value);
                }
                break;
            case SQLDataType.JSON:
                if (typeof value !== 'object' || value instanceof Date) {
                    this.throwUnexpectedProperty(dbProperty, dbColumn, value);
                }
                break;
            case SQLDataType.NUMBER:
                if (typeof value !== 'number') {
                    this.throwUnexpectedProperty(dbProperty, dbColumn, value);
                }
                break;
            case SQLDataType.STRING:
                if (typeof value !== 'string') {
                    this.throwUnexpectedProperty(dbProperty, dbColumn, value);
                }
                break;
        }
    }
    assertRelationValueIsAnObject(relationValue, dbProperty) {
        if (relationValue !== null && relationValue !== undefined &&
            (typeof relationValue != 'object' || relationValue instanceof Date)) {
            throw new Error(`Unexpected value in relation property: ${dbProperty.name}, 
				of entity ${dbProperty.entity.name}`);
        }
    }
    assertManyToOneNotArray(relationValue) {
        if (relationValue instanceof Array) {
            throw new Error(`@ManyToOne relation cannot be an array`);
        }
    }
    assertOneToManyIsArray(relationValue) {
        if (relationValue !== null
            && relationValue !== undefined
            && !(relationValue instanceof Array)) {
            throw new Error(`@OneToMany relation must be an array`);
        }
    }
    isProcessed(entity, 
    // This is a per-operation map (for a single update or create or delete with cascades)
    operatedOnEntityMap, dbEntity, schemaUtils) {
        if (isStub(entity)) {
            return [true, null];
        }
        if (!dbEntity.idColumns.length) {
            throw new Error(`Cannot run 'create'|'bulkCreate'|'update' for entity '${dbEntity.name}' with no @Id(s).
			Please use 'insert'|'updateWhere' instead.`);
        }
        const entityIdData = {
            idColumnValueData: [],
            idKey: null
        };
        // Attempt to get the id, allowing for non-ided entities,
        // fail if (part of) an id is empty.
        const idKey = schemaUtils.getIdKey(entity, dbEntity, false, (idColumn, idValue, propertyNameChains) => {
            entityIdData.idColumnValueData.push({
                idColumn,
                idValue,
                propertyNameChains,
            });
        });
        entityIdData.idKey = idKey;
        if (!idKey) {
            return [false, entityIdData];
        }
        const mapForSchema = ensureChildArray(operatedOnEntityMap, dbEntity.schemaVersion.schema.index);
        const mapForEntityType = ensureChildMap(mapForSchema, dbEntity.index);
        const alreadyOperatedOnEntity = mapForEntityType[idKey];
        if (!alreadyOperatedOnEntity) {
            mapForEntityType[idKey] = entity;
            return [false, entityIdData];
        }
        if (alreadyOperatedOnEntity === entity) {
            // The Update operation for this entity was already recorded, nothing to do
            return [true, null];
        }
        // If it's new entity, not in cache
        let hasNonIdProperties = false;
        for (let propertyName in entity) {
            if (!dbEntity.idColumnMap[propertyName]
                && entity.hasOwnProperty(propertyName)) {
                hasNonIdProperties = true;
                break;
            }
        }
        // If there is at least one non-id property set, then it's not an id-stub
        if (hasNonIdProperties) {
            throw new Error(`More than one non-id-stub instance of '${dbEntity.name}' 
				with @Id(s) value '${entityIdData.idKey}' during mutation operation`);
        }
        // The Update operation for this entity was already recorded, nothing to do
        return [true, null];
    }
    async internalDelete(transaction, ctx) {
        const dbEntity = ctx.dbEntity;
        const entity = ctx.entities[0];
        const qEntity = ctx.ioc.airDb.qSchemas[dbEntity.schemaVersion.schema.index][dbEntity.name];
        const idWhereFragments = [];
        const valuesMapByColumn = [];
        for (let propertyName in entity) {
            if (!entity.hasOwnProperty(propertyName)) {
                continue;
            }
            const dbProperty = dbEntity.propertyMap[propertyName];
            // Skip transient fields
            if (!dbProperty) {
                continue;
            }
            const deletedValue = entity[propertyName];
            let dbRelation;
            if (dbProperty.relation && dbProperty.relation.length) {
                dbRelation = dbProperty.relation[0];
            }
            if (!dbRelation) {
                // If the property is not a transient field and not a relation
                const dbColumn = dbProperty.propertyColumns[0].column;
                this.ensureNonRelationalValue(dbProperty, dbColumn, deletedValue);
                if (this.columnProcessed(dbProperty, valuesMapByColumn, dbColumn, deletedValue)) {
                    continue;
                }
                if (dbProperty.isId) {
                    // For an id property, the value is guaranteed to be the same (and not empty) -
                    // cannot entity-update id fields
                    idWhereFragments.push(qEntity[propertyName].equals(deletedValue));
                }
                continue;
            }
            this.assertRelationValueIsAnObject(deletedValue, dbProperty);
            switch (dbRelation.relationType) {
                case EntityRelationType.MANY_TO_ONE:
                    this.assertManyToOneNotArray(deletedValue);
                    ctx.ioc.schemaUtils.forEachColumnOfRelation(dbRelation, dbEntity, (dbColumn, value, propertyNameChains) => {
                        if (dbProperty.isId && valuesMapByColumn[dbColumn.index] === undefined) {
                            if (ctx.ioc.schemaUtils.isIdEmpty(value)) {
                                throw new Error(`Required Id value is missing in:
								'${dbEntity.name}.${propertyNameChains.join('.')}'`);
                            }
                            let idQProperty = qEntity;
                            for (const propertyNameLink of propertyNameChains[0]) {
                                idQProperty = idQProperty[propertyNameLink];
                            }
                            // For an id property, the value is guaranteed to be the same (and not
                            // empty) - cannot entity-update id fields
                            idWhereFragments.push(idQProperty.equals(value));
                        }
                        this.columnProcessed(dbProperty, valuesMapByColumn, dbColumn, value);
                    }, false);
                    // Cascading on manyToOne is not currently implemented, nothing else needs to
                    // be done
                    break;
                case EntityRelationType.ONE_TO_MANY:
                    // Delete cascading is done on the server - there is no new information
                    // to pull for this from the client
                    break;
                default:
                    throw new Error(`Unknown relationType '${dbRelation.relationType}' 
						for '${dbEntity.name}.${dbProperty.name}'.`);
            }
        }
        let idWhereClause;
        if (idWhereFragments.length > 1) {
            idWhereClause = and(...idWhereFragments);
        }
        else {
            idWhereClause = idWhereFragments[0];
        }
        let rawDelete = {
            deleteFrom: qEntity,
            where: idWhereClause
        };
        let deleteWhere = new Delete(rawDelete);
        return await this.internalDeleteWhere(deleteWhere, transaction, ctx);
    }
}
//# sourceMappingURL=OperationManager.js.map