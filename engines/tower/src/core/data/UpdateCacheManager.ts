import { DI } from "@airport/di"
import {
    DbEntity,
    EntityRelationType,
    EntityState,
    IUpdateCacheManager,
    IEntityStateManager,
    ISaveResult,
    SQLDataType,
    UPDATE_CACHE_MANAGER
} from "@airport/ground-control"

export class UpdateCacheManager
    implements IUpdateCacheManager {

    saveOriginalValues<E, T = E | E[]>(
        entity: T,
        dbEntity: DbEntity,
        entityStateManager: IEntityStateManager
    ): any {
        if (entity instanceof Array) {
            for (let i = 0; i < entity.length; i++) {
                this.saveOriginalValues(
                    entity[i], dbEntity, entityStateManager)
            }
        } else {
            const originalValuesObject: any = {}
            entityStateManager.setOriginalValues(originalValuesObject, entity);
            for (let dbProperty of dbEntity.properties) {
                const property = entity[dbProperty.name]
                if (dbProperty.relation && dbProperty.relation.length) {
                    this.saveOriginalValues(property, dbProperty.relation[0].relationEntity,
                        entityStateManager)
                } else {
                    originalValuesObject[dbProperty.name] = entity[dbProperty.name]
                }
            }
        }
    }

    setOperationState<E, T = E | E[]>(
        entityCopy: T,
        dbEntity: DbEntity,
        entityStateManager: IEntityStateManager,
        processedEntities: Set<any>
    ): void {
        if (entityCopy instanceof Array) {
            for (var i = 0; i < entityCopy.length; i++) {
                this.setOperationState(entityCopy[i], dbEntity,
                    entityStateManager, processedEntities)
            }
        } else {
            if (processedEntities.has(entityCopy)) {
                return
            }
            processedEntities.add(entityCopy)
            const originalValuesObject: any = entityStateManager
                .getOriginalValues(entityCopy)

            let entityState: EntityState = entityCopy[entityStateManager.getStateFieldName()]
            if (!entityCopy['id']) {
                if (entityState === EntityState.DELETE) {
                    throw new Error(
                        'Entity is marked for deletion but does not have an "id" property')
                } else {
                    entityState = EntityState.CREATE
                }
            }
            for (const dbProperty of dbEntity.properties) {
                const property = entityCopy[dbProperty.name]
                if (dbProperty.relation && dbProperty.relation.length) {
                    this.setOperationState(property, dbProperty.relation[0].relationEntity,
                        entityStateManager, processedEntities);
                } else {
                    if (entityState) {
                        continue
                    }
                    let originalValue = originalValuesObject[dbProperty.name]
                    let propertyValue
                    switch (dbProperty.propertyColumns[0].column.type) {
                        case SQLDataType.DATE:
                            originalValue = (originalValue as Date).getTime()
                            propertyValue = (property as Date).getTime()
                            break;
                        // case SQLDataType.JSON:
                        //     originalValue = JSON.stringify(originalValue)
                        //     propertyValue = JSON.stringify(property)
                        //     break;
                        default:
                            break;
                    }
                    if (propertyValue != originalValue) {
                        entityState = EntityState.UPDATE
                    }
                }
            }
            if (!entityState || entityStateManager.isDeleted(entityCopy)) {
                entityState = EntityState.PARENT_ID
            }
            entityCopy[entityStateManager.getStateFieldName()] = entityState
        }
    }

    afterSaveModifications<E, T = E | E[]>(
        entity: T,
        dbEntity: DbEntity,
        saveResult: ISaveResult,
        entityStateManager: IEntityStateManager,
        processedEntities: Set<any>
    ): void {
        this.updateOriginalValuesAfterSave(entity, dbEntity,
            saveResult, entityStateManager)
        this.removeDeletedEntities(entity, dbEntity,
            saveResult, entityStateManager, processedEntities)
    }

    private updateOriginalValuesAfterSave<E, T = E | E[]>(
        entity: T,
        dbEntity: DbEntity,
        saveResult: ISaveResult,
        entityStateManager: IEntityStateManager,
    ): void {
        if (entity instanceof Array) {
            for (let i = 0; i < entity.length; i++) {
                this.updateOriginalValuesAfterSave(entity[i], dbEntity,
                    saveResult, entityStateManager)
            }
        } else {
            let operationUniqueId = entityStateManager.getOperationUniqueId(entity, true, dbEntity)
            let createdRecordId = saveResult.created[operationUniqueId]
            if (createdRecordId) {
                entity['id'] = createdRecordId
            } else {
                let isDeleted = !!saveResult.deleted[operationUniqueId]
                if (isDeleted) {
                    entityStateManager.setIsDeleted(true, entity)
                }
            }
            let originalValue = {}
            for (const dbProperty of dbEntity.properties) {
                const property = entity[dbProperty.name]
                if (dbProperty.relation && dbProperty.relation.length) {
                    this.updateOriginalValuesAfterSave(
                        property, dbProperty.relation[0].relationEntity, saveResult, entityStateManager)
                } else {
                    originalValue[dbProperty.name] = property
                }
            }
            entityStateManager.setOriginalValues(originalValue, entity);
        }
    }

    private removeDeletedEntities<E, T = E | E[]>(
        entity: T,
        dbEntity: DbEntity,
        saveResult: ISaveResult,
        entityStateManager: IEntityStateManager,
        processedEntities: Set<any>
    ): boolean {
        if (entity instanceof Array) {
            for (let i = entity.length - 1; i >= 0; i--) {
                if (this.removeDeletedEntities(
                    entity[i], dbEntity, saveResult, entityStateManager, processedEntities)) {
                    (entity as unknown as E[]).splice(i, 1)
                }
            }
            return !(entity as unknown as E[]).length
        } else {
            if (processedEntities.has(entity)) {
                return entityStateManager.isDeleted(entity)
            }
            processedEntities.add(entity)
            for (const dbRelation of dbEntity.relations) {
                const dbRelationProperty = dbRelation.property
                const property = entity[dbRelationProperty.name];
                if (!property) {
                    continue
                }
                switch (dbRelation.relationType) {
                    case EntityRelationType.MANY_TO_ONE:
                        if (this.removeDeletedEntities(property, dbRelation.relationEntity,
                            saveResult, entityStateManager, processedEntities)) {
                            entity[dbRelationProperty.name] = null
                        }
                        break;
                    case EntityRelationType.ONE_TO_MANY:
                        this.removeDeletedEntities(property, dbRelation.relationEntity,
                            saveResult, entityStateManager, processedEntities)
                        break;
                }
            }
            return entityStateManager.isDeleted(entity)
        }
    }
}
DI.set(UPDATE_CACHE_MANAGER, UpdateCacheManager)