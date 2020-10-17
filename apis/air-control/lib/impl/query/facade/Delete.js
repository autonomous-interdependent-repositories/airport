import { AbstractQuery } from './AbstractQuery';
/**
 * Created by Papa on 10/2/2016.
 */
export class Delete extends AbstractQuery {
    constructor(rawDelete) {
        super();
        this.rawDelete = rawDelete;
    }
    toJSON(queryUtils, fieldUtils) {
        return {
            DF: this.rawDelete.deleteFrom
                .__driver__.getRelationJson(this.columnAliases, queryUtils, fieldUtils),
            W: queryUtils.whereClauseToJSON(this.rawDelete.where, this.columnAliases, fieldUtils)
        };
    }
}
//# sourceMappingURL=Delete.js.map