import { DbColumn, DbProperty, JSONClauseField, JSONClauseObjectType, JsonFieldQuery, JSONSqlFunctionCall } from '@airport/ground-control';
import { IFieldColumnAliases } from '../../../lingo/core/entity/Aliases';
import { IQEntityInternal } from '../../../lingo/core/entity/Entity';
import { IQFieldInternal, IQOrderableField } from '../../../lingo/core/field/Field';
import { IFieldInOrderBy } from '../../../lingo/core/field/FieldInOrderBy';
import { IQFunction } from '../../../lingo/core/field/Functions';
import { RawFieldQuery } from '../../../lingo/query/facade/FieldQuery';
import { IFieldUtils } from '../../../lingo/utils/FieldUtils';
import { IQueryUtils } from '../../../lingo/utils/QueryUtils';
import { FieldColumnAliases } from '../entity/Aliases';
import { IRelationManager } from '../entity/RelationManager';
import { IAppliable } from './Appliable';
/**
 * Created by Papa on 4/21/2016.
 */
export declare abstract class QField<IQF extends IQOrderableField<IQF>> implements IQFieldInternal<IQF>, IAppliable<JSONClauseField, IQF> {
    dbColumn: DbColumn;
    dbProperty: DbProperty;
    q: IQEntityInternal;
    objectType: JSONClauseObjectType;
    alias: string;
    __appliedFunctions__: JSONSqlFunctionCall[];
    __fieldSubQuery__: RawFieldQuery<IQF>;
    constructor(dbColumn: DbColumn, dbProperty: DbProperty, q: IQEntityInternal, objectType: JSONClauseObjectType);
    /**
     protected getFieldKey() {
        let rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.parentQ.getRootJoinEntity());
        let key = `${relationManager.getPositionAlias(rootEntityPrefix, this.parentQ.fromClausePosition)}.${this.fieldName}`;
        return key;
    }
     */
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQF;
    toJSON(columnAliases: IFieldColumnAliases<IQF>, forSelectClause: boolean, queryUtils: IQueryUtils, fieldUtils: IFieldUtils, relationManager: IRelationManager): JSONClauseField;
    asc(): IFieldInOrderBy<IQF>;
    desc(): IFieldInOrderBy<IQF>;
    abstract getInstance(qEntity?: IQEntityInternal): QField<IQF>;
    addSubQuery(subQuery: RawFieldQuery<IQF>): IQF;
    operableFunctionToJson(functionObject: IQFunction<any>, columnAliases: FieldColumnAliases, forSelectClause: boolean, queryUtils: IQueryUtils, fieldUtils: IFieldUtils, relationManager: IRelationManager): JSONClauseField;
    protected copyFunctions<QF extends QField<IQF>>(field: QF): QF;
    protected appliedFunctionsToJson(appliedFunctions: JSONSqlFunctionCall[], columnAliases: IFieldColumnAliases<IQF>, queryUtils: IQueryUtils, fieldUtils: IFieldUtils, relationManager: IRelationManager): JSONSqlFunctionCall[];
    protected functionCallToJson(functionCall: JSONSqlFunctionCall, columnAliases: IFieldColumnAliases<IQF>, queryUtils: IQueryUtils, fieldUtils: IFieldUtils, relationManager: IRelationManager): JSONSqlFunctionCall;
    protected valueToJSON(functionObject: IQFunction<any> | QField<any>, columnAliases: IFieldColumnAliases<IQF>, forSelectClause: boolean, fromFunctionObject: boolean, queryUtils: IQueryUtils, fieldUtils: IFieldUtils, relationManager: IRelationManager): string | JSONClauseField | JsonFieldQuery;
}
//# sourceMappingURL=Field.d.ts.map