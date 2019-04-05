import {
	DatastructureUtils,
	DbEntity,
	DbSchema,
	DbSchemaBuilder,
	IDbSchemaBuilder
}                                      from '@airport/ground-control'
import * as fs                         from 'fs'
import {Configuration}                 from '../options/Options'
import {
	canBeInterface,
	getImplNameFromInterfaceName
}                                      from '../resolve/pathResolver'
import {
	EntityReference,
	PropertyDocEntry
}                                      from './DocEntry'
import {
	EntityCandidate,
	Interface
}                                      from './EntityCandidate'
import {globalCandidateInheritanceMap} from './EntityDefinitionGenerator'
import {FileImports}                   from './FileImports'
import {
	endsWith,
	isPrimitive,
	startsWith
}                                      from './utils'


/**
 * Created by Papa on 3/27/2016.
 */
export class EntityCandidateRegistry {

	entityCandidateMap: Map<string, EntityCandidate> = new Map<string, EntityCandidate>()
	allInterfacesMap: Map<string, Interface[]>       = new Map<string, Interface[]>()
	configuration: Configuration

	dbSchemaBuilder: IDbSchemaBuilder                                                                   = new DbSchemaBuilder(new DatastructureUtils())
	allSchemas: DbSchema[]                                                                              = []
	schemaMap: { [projectName: string]: DbSchema }                                                      = {}
	mappedSuperClassMap: { [projectName: string]: { [mappedSuperClassName: string]: EntityCandidate } } = {}

	dictionary = {
		dbColumnRelationMapByManySide: {},
		dbColumnRelationMapByOneSide: {}
	}

	constructor(
		private enumMap?: Map<string, string>
	) {
	}

	addCandidate(candidate: EntityCandidate): void {
		let matchesExisting = this.matchToExistingEntity(candidate)
		if (!matchesExisting) {
			this.entityCandidateMap.set(candidate.type, candidate)
		} else {
			candidate = this.entityCandidateMap.get(candidate.type)
		}
	}

	matchVerifiedEntities( //
		targetCandidateRegistry?: EntityCandidateRegistry //
	): { [entityName: string]: EntityCandidate } {
		let entityMapByName: { [entityName: string]: EntityCandidate } = {}

		for (let targetCandidate of targetCandidateRegistry.entityCandidateMap.values()) {
			entityMapByName[targetCandidate.type] = targetCandidate
			if (!targetCandidate.parentClassName || targetCandidate.parentEntity) {
				continue
			}
			targetCandidate.parentEntity = targetCandidateRegistry.entityCandidateMap.get(targetCandidate.parentClassName)
			if (targetCandidate.parentEntity) {
				continue
			}
			let parentType = globalCandidateInheritanceMap[targetCandidate.type]
			while (parentType) {
				targetCandidate.parentEntity = targetCandidateRegistry.entityCandidateMap.get(parentType)
				if (targetCandidate.parentEntity) {
					break
				}
				parentType = globalCandidateInheritanceMap[parentType]
			}
			if (targetCandidate.parentEntity) {
				continue
			}

			targetCandidate.parentEntity = this.getMappedSuperclassFromProject(
				targetCandidate.docEntry.fileImports, targetCandidate.parentClassName)
		}

		let entityInterfaceMap: { [interfaceName: string]: Interface } = {}
		for (let className in entityMapByName) {
			let entityCandidate = entityMapByName[className]
			entityCandidate.implementedInterfaceNames.forEach((interfaceName) => {
				let matchingInterfaces = this.allInterfacesMap.get(interfaceName)
				if (!matchingInterfaces || !matchingInterfaces.length) {
					return
				}
				if (matchingInterfaces.length > 1) {
					throw `Found multiple definitions of interface '${interfaceName}' implemented by entity '${className}'.  Interfaces implemented by entity classes must have globally unique names.`
				}
				let anInterface = matchingInterfaces[0]
				anInterface.implementedBySet.add(entityCandidate)
				entityInterfaceMap[interfaceName] = anInterface
			})
		}

		let classifiedEntitySet = this.classifyEntityProperties(entityInterfaceMap)

		return entityMapByName
	}

	classifyEntityProperties(entityInterfaceMap: { [interfaceName: string]: Interface }): Set<EntityCandidate> {
		let classifiedEntitySet: Set<EntityCandidate> = new Set<EntityCandidate>()

		for (let [candidateType, candidate] of this.entityCandidateMap) {
			classifiedEntitySet.add(candidate)
			let properties = candidate.docEntry.properties
			if (!properties) {
				return
			}
			const fileImports = candidate.docEntry.fileImports
			properties.forEach(( //
				property: PropertyDocEntry //
			) => {
				let type = property.type
				if (endsWith(type, '[]')) {
					property.isArray = true
					type             = type.substr(0, type.length - 2)
				} else if (startsWith(type, 'Array<')) {
					type = type.substr(6, type.length - 1)
				}
				property.nonArrayType = type

				property.decorators.filter(
					decorator =>
						decorator.name === 'Column'
				).forEach(
					decorator => {
						decorator.values.filter(
							value =>
								value.columnDefinition
						).forEach(
							value => {
								property.columnDefinition = value.columnDefinition
							})
					})

				switch (type) {
					case 'boolean':
						property.primitive = 'boolean'
						break
					case 'number':
						property.primitive = 'number'
						break
					case 'string':
						property.primitive = 'string'
						break
					case 'Date':
						property.primitive = 'Date'
						break
					case 'any':
						property.primitive = 'any'
						break
				}
				if (property.decorators.some(
					decorator => decorator.name === 'Json')) {
					property.primitive = 'Json'
				}
				if (property.decorators.some(
					decorator => decorator.name === 'DbAny')) {
					property.primitive = 'any'
				}
				if (property.decorators.some(
					decorator => decorator.name === 'DbBoolean')) {
					property.primitive = 'boolean'
				}
				if (property.decorators.some(
					decorator => decorator.name === 'DbDate')) {
					property.primitive = 'Date'
				}
				if (property.decorators.some(
					decorator => decorator.name === 'DbNumber')) {
					property.primitive = 'number'
				}
				if (property.decorators.some(
					decorator => decorator.name === 'DbString')) {
					property.primitive = 'string'
				}
				if (property.primitive) {
					if (property.isArray) {
						throw `Arrays are currently not supported outside of @OneToMany.
						Please use any.
						
						File:     ${property.ownerEntity.path}
						Property: ${property.name}
						`
					}
					return
				}
				const objectMapFragments = type.split(':')
				if (objectMapFragments.length > 1) {
					if (!property.isTransient) {
						throw `Non @Transient properties cannot be object maps.`
					}
					property.isMap                 = true
					const objectMapValueFragment   = objectMapFragments[objectMapFragments.length - 1]
					property.mapValueType          = objectMapValueFragment
						.replace('}', '')
						.replace(';', '')
						.trim()
					type                           = property.mapValueType
					property.mapValueIsPrimitive   = isPrimitive(type)
					const objectMapKeyNameFragment = objectMapFragments[0]
					property.mapKeyName            = objectMapKeyNameFragment
						.replace('{', '')
						.replace('[', '')
						.trim()
					const objectMapKeyTypeFragment = objectMapFragments[1]
					property.mapKeyType            = objectMapKeyTypeFragment
						.replace(']', '')
						.trim()
				}
				if (!property.mapValueIsPrimitive
					&& !fileImports.importMapByObjectAsName[type]
					&& candidateType !== type) {
					throw `Type '${type}' is not an import in ${candidate.path}.` +
					`  All type references in entities must must be imported (needed for DDL hiding).`
				}
				// Do not check transient properties
				if (property.isTransient) {
					return
				}
				const moduleImport = fileImports.importMapByObjectAsName[type]
				if (moduleImport && !moduleImport.isLocal) {
					const projectName    = this.getProjectReferenceFromPath(moduleImport.path)
					property.fromProject = projectName
					this.getReferencedSchema(projectName, property)
				} else {
					let verifiedEntity: EntityCandidate = this.entityCandidateMap.get(type)
					if (verifiedEntity) {
						property.entity = verifiedEntity
						return
					}
					let anInterface = entityInterfaceMap[type]
					if (anInterface) {
						this.registerInterface(anInterface, property)
						property.entity = anInterface.implementation
					} else {
						if (canBeInterface(type)) {
							const entityType = getImplNameFromInterfaceName(type)
							verifiedEntity   = this.entityCandidateMap.get(entityType)
							if (verifiedEntity) {
								const externalInterface          = new Interface(null, type)
								externalInterface.implementation = verifiedEntity
								entityInterfaceMap[type]         = externalInterface
								this.registerInterface(externalInterface, property)
								property.entity = verifiedEntity
							} else {
								throw `Did not find project-local Entity type: '${entityType}' (from interface ${type}).
								Did you forget to decorate it with @Entity()?`
							}
						} else {
							throw `Did not find project-local Entity type: '${type}'.
							Did you forget to decorate it with @Entity()?`
						}
					}
				}

			})
		}

		return classifiedEntitySet
	}

	getReferencedSchema(
		projectName: string,
		property: EntityReference,
	): DbSchema {
		const projectSchema = this.schemaMap[projectName]
		if (projectSchema) {
			property.otherSchemaDbEntity = this.getOtherSchemaEntity(projectName, projectSchema, property)
			return projectSchema
		}
		// const pathsToReferencedSchemas =
		// this.configuration.airport.node_modulesLinks.pathsToReferencedSchemas let
		// relatedSchemaProject if (pathsToReferencedSchemas &&
		// pathsToReferencedSchemas[projectName]) { let referencedSchemaRelativePath =
		// '../../' + pathsToReferencedSchemas[projectName] for (let i = 0; i < 10; i++) {
		// referencedSchemaRelativePath = '../' + referencedSchemaRelativePath let
		// pathToSchema             =
		// getFullPathFromRelativePath(referencedSchemaRelativePath, __filename) if
		// (fs.existsSync(pathToSchema) && fs.lstatSync(pathToSchema).isDirectory()) {
		// relatedSchemaProject = require(pathToSchema) break } } } else {
		// relatedSchemaProject = require(process.cwd() + '/node_modules/' + projectName) }
		const relatedSchemaJson: any = fs.readFileSync(process.cwd() + '/node_modules/' + projectName + '/src/generated/schema.json')
		// if (!relatedSchemaProject) {
		// 	throw `Could not find related schema project '${projectName}'`
		// }
		// if (!relatedSchemaProject.SCHEMA) {
		// 	throw `Could not find related schema in project '${projectName}'`
		// }
		if (!relatedSchemaJson) {
			throw `Could not find related schema in project '${projectName}'`
		}
		const relatedSchema          = JSON.parse(relatedSchemaJson)
		const dbSchema               = this.dbSchemaBuilder.buildDbSchemaWithoutReferences(
			relatedSchema, this.allSchemas, this.dictionary)
		this.schemaMap[projectName]  = dbSchema
		property.otherSchemaDbEntity = this.getOtherSchemaEntity(projectName, dbSchema, property)

		return dbSchema
	}

	private getMappedSuperclassFromProject(
		fileImports: FileImports,
		type: string
	): EntityCandidate {
		const moduleImport = fileImports.importMapByObjectAsName[type]
		if (!moduleImport || moduleImport.isLocal) {
			return null
		}
		const projectName               = this.getProjectReferenceFromPath(moduleImport.path)
		const projectMappedSuperclasses = this.mappedSuperClassMap[projectName]
		if (projectMappedSuperclasses) {
			return projectMappedSuperclasses[type]
		}
		// const pathsToReferencedSchemas =
		// this.configuration.airport.node_modulesLinks.pathsToReferencedSchemas
		let relatedMappedSuperclassesProject
		// if (pathsToReferencedSchemas && pathsToReferencedSchemas[projectName]) {
		// 	let referencedSchemaRelativePath = '../../' +
		// pathsToReferencedSchemas[projectName] for (let i = 0; i < 10; i++) {
		// referencedSchemaRelativePath = '../' + referencedSchemaRelativePath let
		// pathToMappedSuperclasses =
		// getFullPathFromRelativePath(referencedSchemaRelativePath, __filename) if
		// (fs.existsSync(pathToMappedSuperclasses) &&
		// fs.lstatSync(pathToMappedSuperclasses).isDirectory()) {
		// relatedMappedSuperclassesProject = require(pathToMappedSuperclasses) break } } }
		// else {
		relatedMappedSuperclassesProject = require(process.cwd() + '/node_modules/' + projectName)
		// }
		if (!relatedMappedSuperclassesProject) {
			throw `Could not find related schema project '${projectName}'`
		}
		if (!relatedMappedSuperclassesProject.MAPPED_SUPERCLASS) {
			throw `Could not find related Mapped Superclasses in project '${projectName}'`
		}
		const mappedSuperClassMapForProject: { [mappedSuperclasName: string]: EntityCandidate } = {}
		for (const mappedSuperclass of relatedMappedSuperclassesProject.MAPPED_SUPERCLASS) {
			const entityCandidate                                = this.deserializeEntityCandidate(mappedSuperclass)
			mappedSuperClassMapForProject[mappedSuperclass.type] = entityCandidate
		}
		this.mappedSuperClassMap[projectName] = mappedSuperClassMapForProject

		return mappedSuperClassMapForProject[type]
	}

	private deserializeEntityCandidate(
		serializedEntityCandidate
	): EntityCandidate {
		const entityCandidate = new EntityCandidate(null, null, null)
		for (let key in serializedEntityCandidate) {
			entityCandidate[key] = serializedEntityCandidate[key]
		}

		if (entityCandidate.parentEntity) {
			entityCandidate.parentEntity = this.deserializeEntityCandidate(entityCandidate.parentEntity)
		}

		return entityCandidate
	}

	private getOtherSchemaEntity(
		projectName: string,
		dbSchema: DbSchema,
		property: PropertyDocEntry,
	): DbEntity {
		const type              = property.nonArrayType
		let otherSchemaDbEntity = dbSchema.currentVersion.entityMapByName[type]
		if (!otherSchemaDbEntity) {
			if (canBeInterface(type)) {
				const relatedImplementationName = getImplNameFromInterfaceName(type)
				otherSchemaDbEntity             = dbSchema.currentVersion.entityMapByName[relatedImplementationName]
				if (!otherSchemaDbEntity) {
					throw `Could not find entity '${relatedImplementationName}' 
					(from interface ${type}) in project '${projectName}'`
				}
			} else {
				throw `Could not find entity '${type}' in project '${projectName}'`
			}
		}

		return otherSchemaDbEntity
	}

	private registerInterface(
		anInterface: Interface,
		property: PropertyDocEntry
	): void {
		if (anInterface.implementedBySet.size > 1) {
			let implementations: string[] = []
			for (let entity of anInterface.implementedBySet) {
				implementations.push(entity.type)
			}
			throw `Interface ${anInterface.name}, is implemented by more than one entity (${implementations.join(', ')}).  Interfaces used in relations can only be implemented by one entity.`
		}
		let implementedEntity = anInterface.implementedBySet.values().next().value
		property.entity       = implementedEntity
	}

	getProjectReferenceFromPath(
		path: string
	) {
		const pathFragments = path.split('/')

		if (path.indexOf('@') === 0) {
			return pathFragments[0] + '/' + pathFragments[1]
		}

		return pathFragments[0]
	}

	matchToExistingEntity(entityCandidate: EntityCandidate) {
		let existingCandidate = this.entityCandidateMap.get(entityCandidate.type)
		if (!existingCandidate) {
			return false
		}
		return true
	}

}
