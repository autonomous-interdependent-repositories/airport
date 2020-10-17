import { DI } from '@airport/di/lib';
import { Q_METADATA_UTILS } from '../../tokens';
export class QMetadataUtils {
    getAllColumns(qEntity) {
        return qEntity.__driver__.allColumns;
    }
    getAllNonGeneratedColumns(qEntity) {
        return this.getAllColumns(qEntity).filter(qField => !qField.dbColumn.isGenerated);
    }
    getDbEntity(qEntity) {
        return qEntity.__driver__.dbEntity;
    }
    getNewEntity(qEntity, airDb) {
        const dbEntity = qEntity.__driver__.dbEntity;
        const entityConstructor = airDb.qSchemas[dbEntity.schemaVersion.schema.index].__constructors__[dbEntity.name];
        return new entityConstructor();
    }
}
DI.set(Q_METADATA_UTILS, QMetadataUtils);
//# sourceMappingURL=QMetadataUtils.js.map