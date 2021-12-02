import { DI } from '@airport/di'
import {
	DbColumn,
	DbEntity,
	DbProperty,
	EntityRelationType,
	EntityState,
	SQLDataType
} from '@airport/ground-control'
import { IRepositoryEntity } from '@airport/holding-pattern'
import {
	IOperationContext,
	IStructuralEntityValidator
} from '@airport/terminal-map'
import { STRUCTURAL_ENTITY_VALIDATOR } from '../tokens'

export class StructuralEntityValidator
	implements IStructuralEntityValidator {

	async validate<E>(
		records: E[],
		operatedOnEntityIndicator: boolean[],
		context: IOperationContext,
		fromOneToMany = false,
		parentRelationProperty: DbProperty = null,
		parentRelationRecord = null
	): Promise<void> {
		const dbEntity = context.dbEntity

		if (!dbEntity.idColumns.length) {
			throw new Error(
				`Cannot run 'save' for entity '${dbEntity.name}' with no @Id(s).
					Please use non-entity operations (like 'insert' or 'updateWhere') instead.`)
		}

		for (const record of records) {
			const {
				isCreate,
				isParentId,
				isStub
			} = context.ioc.entityStateManager.getEntityStateTypeAsFlags(record, dbEntity)

			if (isParentId) {
				// No processing is needed (already covered by id check)
				continue
			}

			const operationUniqueId = context.ioc.entityStateManager.getOperationUniqueId(record)
			const entityOperatedOn = !!operatedOnEntityIndicator[operationUniqueId]
			if (entityOperatedOn) {
				continue
			}
			operatedOnEntityIndicator[operationUniqueId] = true

			let newRepositoryNeeded = false;

			for (const dbProperty of dbEntity.properties) {
				let propertyValue: any = record[dbProperty.name]
				if (propertyValue === undefined) {
					propertyValue = null
					record[dbProperty.name] = propertyValue
				}
				/*
				 * It is possible for the @Id's of an entity to be in
				 * a @ManyToOne, so we need to check
				 */
				if (dbProperty.relation && dbProperty.relation.length) {
					const dbRelation = dbProperty.relation[0]
					let relatedEntities = null
					let relationIsOneToMany = false
					let isRelationNullable = true
					switch (dbRelation.relationType) {
						case EntityRelationType.MANY_TO_ONE:
							// Id columns are for the parent (currently processed) entity and must be
							// checked as part of this entity
							if (dbProperty.isId) {
								let recordNeedsNewRepository = false;
								context.ioc.applicationUtils.forEachColumnOfRelation(dbRelation, record, (
									dbColumn: DbColumn,
									columnValue: any,
									_propertyNameChains: string[][],
								) => {
									if (dbColumn.notNull) {
										isRelationNullable = false
									}
									if (this.isRepositoryColumnAndNewRepositoryNeed(
										dbEntity, dbProperty, dbColumn,
										isCreate, record, columnValue, context)) {
										recordNeedsNewRepository = true
									}
								}, false)
								if (recordNeedsNewRepository) {
									if (!context.newRepository) {
										context.newRepository =
											await context.ioc.repositoryManager.createRepository(context.actor)
										newRepositoryNeeded = true
									}
									record[dbProperty.name] = context.newRepository
								}
							}
							if (fromOneToMany) {
								// 'actor' or the 'repository' property may be automatically populated
								// in the entity by this.validateRelationColumn
								if (!dbRelation.manyToOneElems || !dbRelation.manyToOneElems.mappedBy
									|| dbRelation.manyToOneElems.mappedBy === parentRelationProperty.name) {
									// Always fix to the parent record
									record[dbProperty.name] = parentRelationRecord
									// if (!propertyValue && !entity[dbProperty.name]) {
									// 	// The @ManyToOne side of the relationship is missing, add it
									// 	entity[dbProperty.name] = parentRelationEntity
									// }
								}
							}
							if (propertyValue) {
								if (propertyValue) {
									relatedEntities = [propertyValue]
								} else if (!isRelationNullable) {
									throw new Error(`Non-nullable relation ${dbEntity.name}.${dbProperty.name} does not have value assigned`)
								} else {
									console.warn(`Probably OK: Nullable @ManyToOne ${dbEntity.name}.${dbProperty.name} does not have anything assigned.`)
								}
							}
							break
						case EntityRelationType.ONE_TO_MANY:
							relationIsOneToMany = true
							relatedEntities = propertyValue
							break
						default:
							throw new Error(`Unexpected relation type ${dbRelation.relationType}
for ${dbEntity.name}.${dbProperty.name}`)
					} // switch dbRelation.relationType
					if (relatedEntities && relatedEntities.length) {
						const previousDbEntity = context.dbEntity
						context.dbEntity = dbRelation.relationEntity
						this.validate(relatedEntities, operatedOnEntityIndicator, context,
							relationIsOneToMany, dbProperty, record)
						context.dbEntity = previousDbEntity
					}
				} // if (dbProperty.relation // If is a relation property
				else {
					const dbColumn = dbProperty.propertyColumns[0].column
					if (dbProperty.isId) {
						const isIdColumnEmpty = context.ioc.applicationUtils.isIdEmpty(propertyValue)
						this.ensureIdValue(dbEntity, dbProperty, dbColumn, isCreate, isIdColumnEmpty)
					} else {
						if (isStub || isParentId) {
							if (propertyValue !== undefined) {
								throw new Error(`Unexpected non-@Id value Stub|ParentId|Deleted record.
Property: ${dbEntity.name}.${dbProperty.name}, with "${context.ioc.entityStateManager.getUniqueIdFieldName()}":  ${operationUniqueId}`)
							}
						}
					}
					this.ensureNonRelationalValue(dbProperty, dbColumn, propertyValue)
				} // else (dbProperty.relation  // If not a relation property
			} // for (const dbProperty of dbEntity.properties)

			this.ensureRepositoryValidity(record, parentRelationRecord, dbEntity,
				parentRelationProperty, isCreate, fromOneToMany, newRepositoryNeeded, context)
		} // for (const record of entities)
	}

	private ensureRepositoryValidity(
		record,
		parentRelationRecord,
		dbEntity: DbEntity,
		parentRelationProperty: DbProperty,
		isCreate: boolean,
		fromOneToMany: boolean,
		newRepositoryNeeded: boolean,
		context: IOperationContext
	) {
		if (!dbEntity.isRepositoryEntity || !parentRelationRecord) {
			return
		}
		if (newRepositoryNeeded) {
			throw new Error(`Error creating a new repository in a nested record:
In Entity: ${dbEntity.name}
That is a child of ${parentRelationProperty.entity.name} via ${parentRelationProperty.entity.name}.${parentRelationProperty.name}
->
When creating a new repository the top level record should be of the newly created repository.
`)
		}
		if (fromOneToMany) {
			return
		}

		let repositoryEntity = record as unknown as IRepositoryEntity
		// If coming from @ManyToOne() the repositories of parent record and child record should match
		if (parentRelationRecord.repository.id === repositoryEntity.repository.id) {
			// If they do this is a valid scenario, no further checks needed
			return
		}

		if (isCreate) {
			throw new Error(`A newly created ${dbEntity.name} via ${dbEntity.name} record for repository id ${repositoryEntity.repository.id} (UUID: ${repositoryEntity.repository.id})
is now being forced to belong to repository id ${repositoryEntity.repository.id} (UUID: ${repositoryEntity.repository.id})
	This is because it is being referenced from a ${parentRelationProperty.entity.name} via ${parentRelationProperty.entity.name} record
	which belongs to repository id ${repositoryEntity.repository.id} (UUID: ${repositoryEntity.repository.id})
	
	Did you mean to set this record's repository to the same one as the referencing record?`)
		}

		// If it doesn't then it is a reference to another repository - switch
		// the record to the parent repository and set the originalRepositoryValue

		// This is done so that the repository always has all of the records it needs
		repositoryEntity.originalRepository = repositoryEntity.repository
		repositoryEntity.repository = parentRelationRecord.repository

		// Aslo set originalActor and originalActorRecordId to look up the original record
		if (!isCreate) { // Check may be needed if code is refactored
			repositoryEntity.originalActor = repositoryEntity.actor
			repositoryEntity.originalActorRecordId = repositoryEntity.actorRecordId
		}
		// reset 'actor' and clear 'actorRecordId' to prevents unique constraint
		// violation if multiple databases flip to the same exact record (independently)
		repositoryEntity.actor = context.actor
		delete repositoryEntity.actorRecordId

		// Flip the state of this record to EntityState.CREATE this record now
		// has to be created in the referencing repository
		repositoryEntity[context.ioc.entityStateManager.getStateFieldName()] = EntityState.CREATE

		// NOTE: If the child record is not provided and it's an optional
		// @ManyToOne() it will be treated as if no record is there.  That is
		// probaby the only correct way to handle it and a warning is
		// shown to the user in this case
	}

	protected isRepositoryColumnAndNewRepositoryNeed<E>(
		dbEntity: DbEntity,
		dbProperty: DbProperty,
		dbColumn: DbColumn,
		isCreate: boolean,
		entity: E,
		columnValue: any,
		context: IOperationContext,
	): boolean {
		if (!dbColumn.idIndex && dbColumn.idIndex !== 0) {
			return
		}
		const isIdColumnEmpty = context.ioc.applicationUtils.isIdEmpty(columnValue)

		if (!dbEntity.isRepositoryEntity) {
			this.ensureIdValue(dbEntity, dbProperty, dbColumn, isCreate, isIdColumnEmpty)
			return false
		}

		if (!isIdColumnEmpty) {
			if (isCreate) {
				if (context.ioc.applicationUtils.isActorId(dbColumn.name)) {
					throw new Error(`Actor cannot be passed in for create Operations`)
				}
			}
			return false
		}
		if (!isCreate) {
			throw new Error(`Ids must be populated in entities for non-Create operations`)
		}
		if (context.ioc.applicationUtils.isRepositoryId(dbColumn.name)) {
			// Repository was not provided - use context's 'newRepository'
			return true
		} else if (context.ioc.applicationUtils.isActorId(dbColumn.name)) {
			// Use context's 'actor'
			entity[dbProperty.name] = context.actor
			return false
		} else if (context.ioc.applicationUtils.isActorRecordId(dbColumn.name)) {
			return false
		}

		throw new Error(`Unexpected @Id column '${dbColumn.name}' in a Repository Entity.`)
	}

	protected ensureIdValue(
		dbEntity: DbEntity,
		dbProperty: DbProperty,
		dbColumn: DbColumn,
		isCreate: boolean,
		isIdColumnEmpty: boolean
	): void {
		if (dbColumn.isGenerated) {
			if (isCreate && !isIdColumnEmpty) {
				throw new Error(
					`@GeneratedValue() @Id() ${dbEntity.name}.${dbProperty.name},
column:  ${dbColumn.name}
must NOT have a value for entity Insert operation.`)
			} else if (!isCreate && isIdColumnEmpty) {
				throw new Error(
					`@GeneratedValue() @Id() ${dbEntity.name}.${dbProperty.name} 
column:  ${dbColumn.name}
must have a value for entity non-Insert operations.`)
			}
		} else if (isIdColumnEmpty) {
			throw new Error(
				`non-@GeneratedValue() @Id() ${dbEntity.name}.${dbProperty.name},
column:  ${dbColumn.name}
must always have a value for all entity operations.`)
		}
	}

	protected ensureNonRelationalValue(
		dbProperty: DbProperty,
		dbColumn: DbColumn,
		value: any
	) {
		if (value === undefined || value === null) {
			return
		}
		switch (dbColumn.type) {
			case SQLDataType.ANY:
				break
			case SQLDataType.BOOLEAN:
				if (typeof value !== 'boolean') {
					this.throwUnexpectedProperty(dbProperty, dbColumn, value)
				}
				break
			case SQLDataType.DATE:
				if (typeof value !== 'object' || !(value instanceof Date)) {
					this.throwUnexpectedProperty(dbProperty, dbColumn, value)
				}
				break
			case SQLDataType.JSON:
				if (typeof value !== 'object' || value instanceof Date) {
					this.throwUnexpectedProperty(dbProperty, dbColumn, value)
				}
				break
			case SQLDataType.NUMBER:
				if (typeof value !== 'number') {
					this.throwUnexpectedProperty(dbProperty, dbColumn, value)
				}
				break
			case SQLDataType.STRING:
				if (typeof value !== 'string') {
					this.throwUnexpectedProperty(dbProperty, dbColumn, value)
				}
				break
		}
	}

	protected throwUnexpectedProperty(
		dbProperty: DbProperty,
		dbColumn: DbColumn,
		value: any
	) {
		throw new Error(
			`Unexpected property value '${value.toString()}' in property '${dbProperty.entity.name}.${dbProperty.name}'
		(column: '${dbColumn.name}').`)
	}

}

DI.set(STRUCTURAL_ENTITY_VALIDATOR, StructuralEntityValidator)
