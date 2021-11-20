import { DI } from '@airport/di/lib'
import {
	DbEntity,
	JSONBaseOperation,
	repositoryEntity
} from '@airport/ground-control'
import { Q_METADATA_UTILS } from '../../tokens'
import { IAirportDatabase } from '../../lingo/AirportDatabase'
import { IQEntityInternal } from '../../lingo/core/entity/Entity'
import { IQOperableFieldInternal } from '../../lingo/core/field/OperableField'
import { IQMetadataUtils } from '../../lingo/utils/QMetadataUtils'

export class QMetadataUtils
	implements IQMetadataUtils {

	getAllColumns(
		qEntity: IQEntityInternal<any>
	): IQOperableFieldInternal<any, JSONBaseOperation, any, any>[] {
		return qEntity.__driver__.allColumns
	}

	getAllNonGeneratedColumns(
		qEntity: IQEntityInternal<any>
	): IQOperableFieldInternal<any, JSONBaseOperation, any, any>[] {
		return this.getAllColumns(qEntity).filter(qField => !qField.dbColumn.isGenerated)
	}

	getAllInsertableColumns(
		qEntity: IQEntityInternal<any>
	): IQOperableFieldInternal<any, JSONBaseOperation, any, any>[] {
		return this.getAllColumns(qEntity).filter(qField => {
			if (qField.dbColumn.isGenerated) {
				return false
			}
			if (qEntity.__driver__.dbEntity.isRepositoryEntity) {
				switch (qField.dbColumn.name) {
					case repositoryEntity.SYSTEM_WIDE_OPERATION_ID:
						return false
				}
			}
			return true
		})
	}

	getDbEntity<IQE extends IQEntityInternal<any>>(
		qEntity: IQE
	): DbEntity {
		return qEntity.__driver__.dbEntity
	}

	getNewEntity(
		qEntity: IQEntityInternal<any>,
		airDb: IAirportDatabase
	): any {
		const dbEntity = qEntity.__driver__.dbEntity
		const entityConstructor = airDb.qSchemas[dbEntity.schemaVersion.schema.index].__constructors__[dbEntity.name]
		if (!entityConstructor) {
			return {}
		}
		return new entityConstructor()
	}

}

DI.set(Q_METADATA_UTILS, QMetadataUtils)
