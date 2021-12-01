import {EntityCandidate} from "../../parser/EntityCandidate";
import {
	MemberData,
	QCoreEntityBuilder
}                        from "../Builder";
import {SIndexedEntity}     from "../application/SEntity";
import {SColumn}            from "../application/SProperty";
import {FileBuilder}        from './FileBuilder'
import {QColumnBuilder}     from "./QColumnBuilder";
import {QEntityFileBuilder} from "./QEntityFileBuilder";
import {QPropertyBuilder}   from "./QPropertyBuilder";
import {QRelationBuilder}   from "./QRelationBuilder";
import {QTransientBuilder}  from "./QTransientBuilder";

/**
 * Created by Papa on 4/25/2016.
 */
export class QEntityBuilder extends QCoreEntityBuilder {

	idColumnBuilders: QColumnBuilder[];
	idPropertyBuilders: QPropertyBuilder[];
	nonIdColumnBuilders: QColumnBuilder[];
	nonIdPropertyBuilders: QPropertyBuilder[];
	nonIdRelationBuilders: QRelationBuilder[];
	idRelationBuilders: QRelationBuilder[];
	transientPropertyBuilders: QTransientBuilder[];

	constructor(
		entity: EntityCandidate,
		fullGenerationPath: string,
		workingDirPath: string,
		fileBuilder: FileBuilder,
		entityMapByName: { [entityName: string]: EntityCandidate },
		public sIndexedEntity: SIndexedEntity
	) {
		super(entity, fullGenerationPath, workingDirPath, fileBuilder, entityMapByName);

		let idColumns = [];
		if (sIndexedEntity) {
			idColumns = sIndexedEntity.idColumns;
		}
		this.idColumnBuilders   = this.getColumnBuilders(idColumns);
		const idProperties      = entity.getIdProperties();
		this.idPropertyBuilders = this.getPropertyBuilders(idProperties);
		this.idRelationBuilders = this.getRelationBuilders(idProperties, true);

		let nonIdColumns = [];
		if (sIndexedEntity) {
			nonIdColumns = sIndexedEntity.columns.filter((
				column: SColumn
			) => {
				if (idColumns.some(
					idColumn => column.name === idColumn.name)) {
					return false;
				}
				return true;
			});
		}
		this.nonIdColumnBuilders = this.getColumnBuilders(nonIdColumns);

		const nonIdProperties          = entity.getNonIdProperties();
		this.nonIdPropertyBuilders     = this.getPropertyBuilders(nonIdProperties);
		this.nonIdRelationBuilders     = this.getRelationBuilders(nonIdProperties, true);
		this.transientPropertyBuilders = this.getTransientPropertyBuilders(entity.getTransientProperties());
	}

	build(): string {
		const idPropertyData: MemberData
			      = this.buildPropertyData(this.idPropertyBuilders);
		const nonIdPropertyData: MemberData
			      = this.buildPropertyData(this.nonIdPropertyBuilders);
		const nonIdRelationData: MemberData
			      = this.buildRelationData(this.nonIdRelationBuilders);
		const idRelationData: MemberData
			      = this.buildRelationData(this.idRelationBuilders);

		let parentEntityQType = 'IQEntity';
		if (this.entity.parentEntity) {
			parentEntityQType = 'Q' + this.entity.parentEntity.type;
		}

		let qName = `Q${this.entity.docEntry.name}`;

		let interfaceGenericAndExtends;
		if(this.entity.docEntry.isMappedSuperclass) {
			interfaceGenericAndExtends = `<T> extends ${parentEntityQType}<T>`
		} else {
			interfaceGenericAndExtends = ` extends ${parentEntityQType}<${this.entity.docEntry.name}>`
		}

		let classSource = `/**
 * Query Entity Query Definition (used for Q.EntityName).
 */
export interface ${qName}${interfaceGenericAndExtends}
{
	// Id Fields
${idPropertyData.definitions}
	// Id Relations
${idRelationData.definitions}
	// Non-Id Fields
${nonIdPropertyData.definitions}
	// Non-Id Relations
${nonIdRelationData.definitions}
}
`;

		return classSource;
	}
}
