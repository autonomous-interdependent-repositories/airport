import { DomainName, SchemaIndex, SchemaName, SchemaStatus, SchemaVersionId } from '@airport/ground-control';
import { BaseSchemaDao, IBaseSchemaDao, ISchema } from '../generated/generated';
export interface ISchemaDao extends IBaseSchemaDao {
    findAllActive(): Promise<ISchema[]>;
    findMapByVersionIds(schemaVersionIds: SchemaVersionId[]): Promise<Map<SchemaIndex, ISchema>>;
    findMaxVersionedMapBySchemaAndDomainNames(schemaDomainNames: DomainName[], schemaNames: SchemaName[]): Promise<Map<DomainName, Map<SchemaName, ISchema>>>;
    setStatusByIndexes(indexes: SchemaIndex[], status: SchemaStatus): Promise<void>;
    findMapByNames(schemaNames: SchemaName[]): Promise<Map<SchemaName, ISchema>>;
}
export declare class SchemaDao extends BaseSchemaDao implements ISchemaDao {
    findAllActive(): Promise<ISchema[]>;
    findMapByVersionIds(schemaVersionIds: SchemaVersionId[]): Promise<Map<SchemaVersionId, ISchema>>;
    findMaxIndex(): Promise<SchemaIndex>;
    findMaxVersionedMapBySchemaAndDomainNames(schemaDomainNames: DomainName[], schemaNames: SchemaName[]): Promise<Map<DomainName, Map<SchemaName, ISchema>>>;
    setStatusByIndexes(indexes: SchemaIndex[], status: SchemaStatus): Promise<void>;
    findMapByNames(schemaNames: SchemaName[]): Promise<Map<SchemaName, ISchema>>;
}
//# sourceMappingURL=SchemaDao.d.ts.map