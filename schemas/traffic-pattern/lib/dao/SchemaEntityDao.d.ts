import { SchemaVersionId } from '@airport/ground-control';
import { BaseSchemaEntityDao, IBaseSchemaEntityDao, ISchemaEntity } from '../generated/generated';
export interface ISchemaEntityDao extends IBaseSchemaEntityDao {
    findAllForSchemaVersions(schemaVersionIds: SchemaVersionId[]): Promise<ISchemaEntity[]>;
}
export declare class SchemaEntityDao extends BaseSchemaEntityDao implements ISchemaEntityDao {
    findAllForSchemaVersions(schemaVersionIds: SchemaVersionId[]): Promise<ISchemaEntity[]>;
}
//# sourceMappingURL=SchemaEntityDao.d.ts.map