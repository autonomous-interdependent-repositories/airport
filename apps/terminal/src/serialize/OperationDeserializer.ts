import {
    IOperationDeserializer,
    OPERATION_DESERIALIZER
} from "@airport/check-in";
import { DI } from "@airport/di";
import {
    EntityState,
    IEntityStateManager
} from "@airport/pressurization";

interface IDeserializableOperation {
    lookupTable: any[]
}

export class OperationDeserializer
    implements IOperationDeserializer {

    deserialize<E, T = E | E[]>(
        entity: T,
        entityStateManager: IEntityStateManager
    ): T {
        const operation: IDeserializableOperation = {
            lookupTable: [],
        }
        let deserializedEntity
        if (entity instanceof Array) {
            deserializedEntity = <any><E[]>entity.map(anEntity => this.doDeserialize(
                anEntity, operation, entityStateManager))
        } else {
            deserializedEntity = this.doDeserialize(
                entity, operation, entityStateManager)
        }

        return deserializedEntity
    }

    doDeserialize<E>(
        entity: E,
        operation: IDeserializableOperation,
        entityStateManager: IEntityStateManager,
    ): E {
        let state = entityStateManager.getEntityState(entity)
        switch (state) {
            case EntityState.RESULT_DATE:
                return <any>new Date(entity['value'])
        }

        let operationUniqueId = entityStateManager.getOperationUniqueId(entity)
        if (!operationUniqueId || typeof operationUniqueId !== 'number'
            || operationUniqueId < 1 || operationUniqueId % 1 === 0) {
            throw new Error(`Invalid or missing ${entityStateManager.getUniqueIdFieldName()} field.`)
        }

        let alreadyDeserializedEntity = operation.lookupTable[operationUniqueId]
        switch (state) {
            case EntityState.STUB: {
                let alreadyDeserializedEntity = operation.lookupTable[operationUniqueId]
                if (!alreadyDeserializedEntity) {
                    throw new Error(`Could not find an already present entity for
					${entityStateManager.getUniqueIdFieldName()} of ${operationUniqueId}`)
                }
                return alreadyDeserializedEntity
            }
            default:
                if (alreadyDeserializedEntity) {
                    throw new Error(`Entity appears more than once for
					${entityStateManager.getUniqueIdFieldName()} of ${operationUniqueId}`)
                }
        }

        let deserializedEntity: any = {}
        operation.lookupTable[operationUniqueId] = deserializedEntity
		deserializedEntity[entityStateManager.getStateFieldName()] = state

        for (const propertyName in entity) {
            const property = entity[propertyName]
            let propertyCopy
            if (property instanceof Object) {
                if (property instanceof Array) {
                    propertyCopy = property.map(aProperty => this.doDeserialize(
                        aProperty, operation, entityStateManager))
                } else {
                    propertyCopy = this.doDeserialize(property, operation, entityStateManager)
                }
            } else {
                propertyCopy = property
            }
            deserializedEntity[propertyName] = propertyCopy
        }

        return deserializedEntity
    }

}
DI.set(OPERATION_DESERIALIZER, OperationDeserializer);