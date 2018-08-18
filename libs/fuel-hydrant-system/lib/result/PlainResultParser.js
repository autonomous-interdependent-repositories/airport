"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IEntityResultParser_1 = require("./entity/IEntityResultParser");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this parser is to split a flat row of result set cells into an facade graph (just for that row).
 */
class PlainResultParser extends IEntityResultParser_1.AbstractObjectResultParser {
    addEntity(entityAlias, dbEntity) {
        return this.utils.Schema.getNewEntity(dbEntity);
    }
    addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
        return this.utils.objectExists(propertyValue);
    }
    bufferManyToOneStub(entityAlias, dbEntity, resultObject, propertyName, relationDbEntity, relationInfos) {
        this.addManyToOneStub(resultObject, propertyName, relationInfos);
    }
    bufferManyToOneObject(entityAlias, dbEntity, resultObject, propertyName, relationDbEntity, childResultObject) {
        resultObject[propertyName] = childResultObject;
    }
    bufferBlankManyToOneStub(entityAlias, resultObject, propertyName, relationInfos) {
        resultObject[propertyName] = null;
        // Nothing to do the facade simply doesn't have anything in it
    }
    bufferBlankManyToOneObject(entityAlias, resultObject, propertyName) {
        resultObject[propertyName] = null;
        // Nothing to do the facade simply doesn't have anything in it
    }
    bufferOneToManyStub(otmDbEntity, otmPropertyName) {
        throw `@OneToMany stubs not allowed in QueryResultType.PLAIN`;
    }
    bufferOneToManyCollection(entityAlias, resultObject, otmDbEntity, propertyName, relationDbEntity, childResultObject) {
        resultObject[propertyName] = [childResultObject];
    }
    bufferBlankOneToMany(entityAlias, resultObject, otmEntityName, propertyName, relationDbEntity) {
        resultObject[propertyName] = [];
    }
    flushEntity(entityAlias, dbEntity, selectClauseFragment, entityId, resultObject) {
        // Nothing to be done, plain objects don't need to be flushed since they don't relate do any other rows
        return resultObject;
    }
    flushRow() {
        // Nothing to be done, plain rows don't need to be flushed since they don't relate do any other rows
    }
    bridge(parsedResults, selectClauseFragment) {
        // Nothing to be done, plain queries are not bridged
        return parsedResults;
    }
}
exports.PlainResultParser = PlainResultParser;
//# sourceMappingURL=PlainResultParser.js.map