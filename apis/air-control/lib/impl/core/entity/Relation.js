import { DI } from '@airport/di';
import { JoinType } from '@airport/ground-control';
import { AIR_DB, RELATION_MANAGER, SCHEMA_UTILS } from '../../../tokens';
/**
 * Created by Papa on 4/26/2016.
 */
export function QRelation(dbRelation, parentQ) {
    this.dbRelation = dbRelation;
    this.parentQ = parentQ;
}
QRelation.prototype.innerJoin = function () {
    return this.getNewQEntity(JoinType.INNER_JOIN);
};
QRelation.prototype.leftJoin = function () {
    return this.getNewQEntity(JoinType.LEFT_JOIN);
};
QRelation.prototype.getNewQEntity = function (joinType) {
    const [airDb, relationManager, schemaUtils] = DI.db()
        .getSync(AIR_DB, RELATION_MANAGER, SCHEMA_UTILS);
    const dbEntity = this.dbRelation.property.entity;
    const qEntityConstructor = schemaUtils.getQEntityConstructor(this.dbRelation.relationEntity, airDb);
    let newQEntity = new qEntityConstructor(dbEntity, relationManager.getNextChildJoinPosition(this.parentQ.__driver__), this.dbRelation, joinType);
    newQEntity.__driver__.parentJoinEntity = this.parentQ;
    return newQEntity;
};
//# sourceMappingURL=Relation.js.map