import { JsonApplicationWithApi } from '@airport/check-in';
import {
	AJsonPropertyIndexConfiguration,
	ColumnIndex,
	DatabaseIndexConfiguration,
	DatabaseObjectConfiguration,
	DatabaseOneToManyElements,
	DbEntity,
	DbApplication,
	EntityRelationType,
	getSqlDataType,
	IntermediatePropertyIndexConfiguration,
	JsonDatabaseObjectConfiguration,
	JsonOperation,
	JsonApplication,
	JsonApplicationColumn,
	JsonApplicationEntity,
	JsonApplicationProperty,
	JsonApplicationRelation,
	ApplicationIndex,
	ApplicationReferenceByIndex,
	TableIndex
} from '@airport/ground-control';
import { currentApplicationApi } from '../../../api/parser/ApiGenerator';
import { getExpectedPropertyIndexesFormatMessage } from '../../../ParserUtils';
import { Configuration } from '../../options/Options';
import { EntityCandidate } from '../../parser/EntityCandidate';
import { SEntity, SIndexedEntity } from './SEntity';
import { SProperty, SRelation } from './SProperty';
import {
	SIndexedApplication,
	SApplicationReference
} from './SApplication';
import { SApplicationBuilder } from './SApplicationBuilder';

export class JsonApplicationBuilder {

	existingApplication: JsonApplication;

	// applicationVarName = 'APPLICATION'

	constructor(
		private config: Configuration,
		private entityMapByName: { [entityName: string]: EntityCandidate },
		existingApplicationString: string
	) {
		if (existingApplicationString) {
			// const indexOfAssignment = existingApplicationString.indexOf(this.applicationVarName + ' = {')
			//
			// const errorMessage = `Could not parse existing application, make sure file starts with with:
			// 	 "export const ${this.applicationVarName} = {"
			// 	 where "{" marks the start of the application definition, and ends with:
			// 	 "};"
			// 	 where "}" marks the end of the application definition.`
			//
			// if (indexOfAssignment < 0) {
			// 	throw new Error(errorMessage)
			// }
			// if (existingApplicationString.indexOf('};') !== existingApplicationString.length - 2) {
			// 	throw new Error(errorMessage)
			// }
			//
			// existingApplicationString = existingApplicationString.substring(indexOfAssignment + 9,
			// existingApplicationString.length - 1)

			this.existingApplication = JSON.parse(existingApplicationString);
		}
	}

	build(
		domain: string,
		applicationMapByProjectName: { [projectName: string]: DbApplication },
		entityOperationMap: { [entityName: string]: { [operationName: string]: JsonOperation } }
	): [JsonApplicationWithApi, SIndexedApplication] {
		const sApplicationBuilder = new SApplicationBuilder(this.config, this.entityMapByName);

		const sIndexedApplication = sApplicationBuilder.build(applicationMapByProjectName);

		const jsonApplication = this.convertSIndexedApplicationToJsonApplication(domain, sIndexedApplication);

		// TODO: reset table and column and relation indexes based on existing application

		return [jsonApplication, sIndexedApplication];
	}

	addOperations(
		jsonApplication: JsonApplication,
		entityOperationMap: { [entityName: string]: { [operationName: string]: JsonOperation } }
	) {
		jsonApplication.versions[jsonApplication.versions.length - 1].entities.forEach(jsonEntity => {
			let entityOperations = entityOperationMap[jsonEntity.name];
			if (!entityOperations) {
				return;
			}
			jsonEntity.operations = entityOperations;
		});
	}

	private convertSIndexedApplicationToJsonApplication(
		domain: string,
		sIndexedApplication: SIndexedApplication,
	): JsonApplicationWithApi {
		const jsonEntities: JsonApplicationEntity[] = sIndexedApplication.entities.map(
			sIndexedEntity => {
				const sEntity = sIndexedEntity.entity;
				const columns: JsonApplicationColumn[] = sIndexedEntity.columns.map(
					sColumn => {
						const jsonColumn: JsonApplicationColumn = {
							allocationSize: sColumn.allocationSize,
							// columnDefinition: sColumn.columnDefinition,
							index: sColumn.index,
							isGenerated: sColumn.isGenerated === undefined ? false : sColumn.isGenerated,
							manyRelationColumnRefs: [],
							name: sColumn.name,
							notNull: sColumn.notNull,
							propertyRefs: sColumn.propertyRefs.map(
								index => ({
									index
								})),
							sinceVersion: 1,
							type: getSqlDataType(sColumn.type),
						};
						if (sColumn.precision) {
							jsonColumn.precision = sColumn.precision;
						}
						if (sColumn.scale) {
							jsonColumn.scale = sColumn.scale;
						}
						return jsonColumn;
					});
				columns.sort((
					a,
					b
				) =>
					a.index < b.index ? -1 : 1
				);

				const [properties, relations] = this.getPropertiesAndRelations(sIndexedApplication, sIndexedEntity, columns);

				const tableConfig = this.convertTableConfig(sEntity)

				return {
					columns,
					idColumnRefs: this.getIdColumnReferences(sIndexedEntity),
					index: sEntity.tableIndex,
					isLocal: sEntity.isLocal,
					isRepositoryEntity: sEntity.isRepositoryEntity,
					name: sEntity.name,
					properties: properties,
					relations: relations,
					sinceVersion: 1,
					tableConfig,
				};
			});

		// FIXME: add application versioning support
		return {
			domain,
			index: null,
			name: sIndexedApplication.application.name,
			packageName: sIndexedApplication.application.name,
			sinceVersion: 1,
			versions: [{
				api: currentApplicationApi,
				entities: jsonEntities,
				integerVersion: 1,
				referencedApplications: sIndexedApplication.application.referencedApplications.map((
					sApplicationReference: SApplicationReference
				) => ({
					domain: sApplicationReference.dbApplication.domain.name,
					index: sApplicationReference.index,
					name: sApplicationReference.dbApplication.name,
					packageName: sApplicationReference.dbApplication.packageName,
					sinceVersion: 1,
					versions: [{
						entities: null,
						integerVersion: 1,
						referencedApplications: null,
						versionString: '1.0.0'
					}]
				})),
				versionString: '1.0.0'
			}]
		};
	}

	private convertTableConfig<DIC extends DatabaseIndexConfiguration>(
		sEntity: SEntity
	): JsonDatabaseObjectConfiguration<DIC> {
		if (!sEntity.table) {
			return null
		}
		if (!sEntity.table.indexes) {

			return {
				name: sEntity.table.name
			}
		}

		const rawPropertyIndexes: IntermediatePropertyIndexConfiguration = sEntity.table.indexes as any
		if (!rawPropertyIndexes.body) {
			return {
				name: sEntity.table.name,
				columnIndexes: sEntity.table.indexes as any
			}
		}

		if (!rawPropertyIndexes.parameters || rawPropertyIndexes.parameters.length !== 1) {
			throw new Error(`Unexpected number of parameters in 'indexes' arrow function.${getExpectedPropertyIndexesFormatMessage()}`);
		}

		const propertyMapByName: Map<string, SProperty> = new Map()
		for (let property of sEntity.properties) {
			propertyMapByName.set(property.name, property)
		}

		const parameter = rawPropertyIndexes.parameters[0]
		if (parameter.type !== sEntity.name) {
			throw new Error(`Unexpected type of 'indexes' arrow function parameter,
	expecting '${parameter.type}' got '${parameter.type}'.${getExpectedPropertyIndexesFormatMessage()}`)
		}

		const propertyIndexes = rawPropertyIndexes.body.map((rawPropertyIndex, index) => {
			if (!rawPropertyIndex.property) {
				throw new Error(`Propery based index #${index + 1} does not have a 'property'
	specified.${getExpectedPropertyIndexesFormatMessage()}`)
			}

			const objectPropertyFragments = rawPropertyIndex.property.split('.')
			if (objectPropertyFragments.length !== 2) {
				throw new Error(`PropertyBased index #${index + 1} does not have correct property syntax.
Expecting entityAlias.propertyName.${getExpectedPropertyIndexesFormatMessage()}`)
			}

			if (objectPropertyFragments[0] !== parameter.name) {
				throw new Error(`PropertyBased index #${index + 1} does not have correct property syntax.
Expecting entityAlias.propertyName.${getExpectedPropertyIndexesFormatMessage()}`)
			}

			let propertyName = objectPropertyFragments[1]
			let property = propertyMapByName.get(propertyName)
			if (!property) {
				throw new Error(`PropertyBased index #${index + 1} does not have a valid property name.
Expecting ${parameter.name}.propertyName.  Got ${parameter.name}.${propertyName} ${getExpectedPropertyIndexesFormatMessage()}`)
			}

			const coreConfig: AJsonPropertyIndexConfiguration = {
				propertyIndex: property.index
			}

			if (rawPropertyIndex.unique === true) {
				coreConfig.unique = true
			}

			return coreConfig
		})

		return {
			name: sEntity.table.name,
			propertyIndexes
		}
	}

	private getIdColumnReferences(
		sIndexedEntity: SIndexedEntity
	): ApplicationReferenceByIndex<ColumnIndex>[] {
		return sIndexedEntity.idColumns.map(
			sColumn => ({
				index: sColumn.index
			}));
	}

	private getPropertiesAndRelations(
		sIndexedApplication: SIndexedApplication,
		sIndexedEntity: SIndexedEntity,
		columns: JsonApplicationColumn[],
	): [JsonApplicationProperty[], JsonApplicationRelation[]] {
		const relations = [];
		const properties = sIndexedEntity.entity.properties.map((
			sProperty,
			index
		) => {
			let columnRef;
			let relationRef;

			const sRelation = sProperty.relation;
			if (!sRelation) {
				const sColumn = sProperty.columns[0];
				columnRef = {
					index: sColumn.index
				};

			} else {
				let relationTableApplicationIndex: number;
				let relationApplicationIndex: ApplicationIndex;
				let relationTableIndex: TableIndex;
				let relatedIndexedEntity: SIndexedEntity | DbEntity;
				if (sRelation.referencedApplicationIndex || sRelation.referencedApplicationIndex === 0) {
					relationTableApplicationIndex = sRelation.referencedApplicationIndex;
					const relatedDbApplication = sIndexedApplication.application.referencedApplications[sRelation.referencedApplicationIndex];
					relationApplicationIndex = relatedDbApplication.index;
					relatedIndexedEntity = relatedDbApplication.dbApplication
						.currentVersion[0].applicationVersion.entityMapByName[sRelation.entityName];
					relationTableIndex = relatedIndexedEntity.index;
				} else {
					relatedIndexedEntity = sIndexedApplication.entityMapByName[sRelation.entityName];
					relationApplicationIndex = null;
					relationTableIndex = relatedIndexedEntity.entity.tableIndex;
				}

				this.buildColumnRelations(
					sIndexedEntity, sRelation, relatedIndexedEntity,
					relationApplicationIndex, relationTableIndex, columns);

				const relation: JsonApplicationRelation = {
					// addToJoinFunction: sRelation.addToJoinFunction,
					foreignKey: sRelation.foreignKey,
					index: sRelation.index,
					isId: sProperty.isId,
					// isRepositoryJoin: sRelation.repositoryJoin,
					// joinFunctionWithOperator: sRelation.joinFunctionWithOperator,
					manyToOneElems: sRelation.manyToOne,
					oneToManyElems: this.prepOneToManyElems(sRelation.oneToMany),
					relationType: sRelation.relationType,
					propertyRef: {
						index: index
					},
					relationTableIndex,
					relationTableApplicationIndex,
					sinceVersion: 1
				};
				relations[sRelation.index] = relation;
				relationRef = {
					index: sRelation.index
				};
			}

			return {
				columnRef,
				index,
				isId: sProperty.isId,
				name: sProperty.name,
				relationRef,
				sinceVersion: 1
			};
		});

		return [properties, relations];
	}

	private buildColumnRelations(
		sIndexedEntity: SIndexedEntity,
		sRelation: SRelation,
		relatedIndexedEntity: SIndexedEntity | DbEntity,
		relationApplicationIndex: number,
		relationTableIndex: number,
		columns: JsonApplicationColumn[]
	): void {
		switch (sRelation.relationType) {
			case EntityRelationType.MANY_TO_ONE:
				break;
			case EntityRelationType.ONE_TO_MANY:
				// Currently only need to build manyRelationColumnRefs for ManyToOne relations.
				return;
			default:
				throw new Error(`Unknown relation type: ${sRelation.relationType}.`);
		}
		sRelation.sRelationColumns.map(
			sRelationColumn => {
				if (!sRelationColumn.manyToOne) {
					return;
				}
				let ownColumnIndex;
				// if (sRelationColumn.ownColumnIdIndex) {
				// 	ownColumnIndex = sIndexedEntity.idColumns[sRelationColumn.ownColumnIdIndex].index
				// } else {
				ownColumnIndex = sIndexedEntity.columnMap[sRelationColumn.ownColumnReference].index;
				// }
				let relationColumnIndex;
				// if (sRelationColumn.relationColumnIdIndex
				// 	|| sRelationColumn.relationColumnIdIndex == 0) {
				// 	relationColumnIndex =
				// relatedIndexedEntity.idColumns[sRelationColumn.relationColumnIdIndex].index } else {
				relationColumnIndex = relatedIndexedEntity.columnMap[sRelationColumn.relationColumnReference].index;
				// }

				const column = columns[ownColumnIndex];

				column.manyRelationColumnRefs.push({
					manyRelationIndex: sRelation.index,
					oneApplicationIndex: relationApplicationIndex,
					oneTableIndex: relationTableIndex,
					oneRelationIndex: sRelationColumn.oneSideRelationIndex,
					oneColumnIndex: relationColumnIndex,
					sinceVersion: 1
				});

			});
	}

	private prepOneToManyElems(
		elems: DatabaseOneToManyElements
	): DatabaseOneToManyElements {
		if (!elems) {
			return elems;
		}
		return {
			mappedBy: elems.mappedBy
		};
	}

}