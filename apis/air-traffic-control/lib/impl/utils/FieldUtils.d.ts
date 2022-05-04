import { JsonFieldQuery } from '@airport/ground-control';
import { IEntityAliases } from '../../lingo/core/entity/Aliases';
import { IQOrderableField } from '../../lingo/core/field/Field';
import { RawFieldQuery } from '../../lingo/query/facade/FieldQuery';
import { IFieldUtils } from '../../lingo/utils/FieldUtils';
import { IQueryUtils } from '../../lingo/utils/QueryUtils';
import { IRelationManager } from '../core/entity/RelationManager';
import { FieldQuery } from '../query/facade/FieldQuery';
export declare class FieldUtils implements IFieldUtils {
    relationManager: IRelationManager;
    FieldQuery: typeof FieldQuery;
    getFieldQueryJson<IQF extends IQOrderableField<IQF>>(fieldSubQuery: RawFieldQuery<IQF>, entityAliases: IEntityAliases, queryUtils: IQueryUtils): JsonFieldQuery;
}
//# sourceMappingURL=FieldUtils.d.ts.map