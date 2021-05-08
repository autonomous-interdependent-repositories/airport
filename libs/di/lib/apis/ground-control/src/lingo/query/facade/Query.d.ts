import { JSONRelation } from '../../core/entity/Relation';
import { JSONFieldInOrderBy } from '../../core/field/FieldInOrderBy';
import { JSONBaseOperation } from '../../core/operation/Operation';
export declare enum JsonStatementType {
    ENTITY_QUERY = 0,
    NON_ENTITY_QUERY = 1
}
/**
 * All JSON Statements extend this object (have an optional where clause)
 */
export interface JsonStatement {
    /**
     * Type of statement
     */
    /**
     * WHERE
     */
    W?: JSONBaseOperation;
}
/**
 * Internal query format used to serialize queries (in JSON).
 */
export interface JsonQuery extends JsonStatement {
    /**
     * FROM
     */
    F?: JSONRelation[];
    /**
     * ORDER BY
     */
    OB?: JSONFieldInOrderBy[];
    /**
     * SELECT
     */
    S: any;
}
/**
 * Serialized format for the LIMIT, OFFSET clauses of a query.
 */
export interface JsonLimitedQuery {
    /**
     * LIMIT
     */
    L?: number;
    /**
     * OFFSET
     */
    O?: number;
}
//# sourceMappingURL=Query.d.ts.map