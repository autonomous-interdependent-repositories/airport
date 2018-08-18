"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ground_control_1 = require("@airport/ground-control");
const IEntityResultParser_1 = require("./entity/IEntityResultParser");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
class TreeResultParser extends IEntityResultParser_1.AbstractObjectResultParser {
    constructor() {
        super(...arguments);
        this.currentRowObjectMap = {};
        this.objectEqualityMap = {};
        this.lastRowObjectMap = {};
        this.currentObjectOneToManys = {};
    }
    addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return this.utils.objectExists(propertyValue);
        }
        // Both last and current objects must exist here
        let lastObject = this.lastRowObjectMap[entityAlias];
        // Both of the properties are truthy
        switch (dataType) {
            case ground_control_1.SQLDataType.DATE:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName].getTime());
                break;
            default:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
                break;
        }
        return true;
    }
    isDifferentOrDoesntExist(entityAlias, resultObject, propertyName) {
        // If we already know that this is a new facade, no need to keep on checking
        if (!this.objectEqualityMap[entityAlias]) {
            return true;
        }
        let lastObject = this.lastRowObjectMap[entityAlias];
        // If there was no last facade
        if (!lastObject) {
            this.objectEqualityMap[entityAlias] = false;
            return true;
        }
        if (!resultObject) {
            return true;
        }
        // Types are guaranteed to be the same, so:
        // If the last property is not there or is falsy
        if (!lastObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !resultObject[propertyName];
            return true;
        } // If the current property is not there or is falsy
        else if (!resultObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !lastObject[propertyName];
            return true;
        }
        return false;
    }
    addOneToManyCollection(entityAlias, resultObject, propertyName) {
        let currentOtmCollection = resultObject[propertyName];
        this.currentObjectOneToManys[propertyName] = currentOtmCollection;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        let lastObject = this.lastRowObjectMap[entityAlias];
        let lastOtmCollection = lastObject[propertyName];
        // Now both arrays are guaranteed to exist
        // TODO: verify assumption below:
        // For @OneToMany collections, if existence of last child facade changes it must be a new facade
        if (!lastOtmCollection.length) {
            if (currentOtmCollection.length) {
                this.objectEqualityMap[entityAlias] = false;
            }
        }
        else if (!currentOtmCollection.length) {
            if (lastOtmCollection.length) {
                this.objectEqualityMap[entityAlias] = false;
            }
        }
        // Otherwise if it still exists
    }
    mergeEntity(entityAlias, resultObject) {
        let isSameObjectAsLastRow = this.objectEqualityMap[entityAlias];
        this.objectEqualityMap[entityAlias] = true;
        let oneToManys = this.currentObjectOneToManys;
        this.currentObjectOneToManys = {};
        // If it's a new facade
        if (!isSameObjectAsLastRow) {
            return resultObject;
        }
        // All equality checks have passed - this is the same exact facade as last time
        resultObject = this.lastRowObjectMap[entityAlias];
        this.currentRowObjectMap[entityAlias] = resultObject;
        // All @ManyToOnes have been merged automatically (because they are entities themselves)
        // For @OneToManys:
        // If the current one it the same as the last one of the ones in the last entity then it's the same
        // otherwise its new and should be added to the collection
        for (let oneToManyProperty in oneToManys) {
            let currentOneToMany = oneToManys[oneToManyProperty];
            if (currentOneToMany && currentOneToMany.length) {
                // There will always be only one current record, since this is done per result set row
                let currentMto = currentOneToMany[0];
                let existingOneToMany = resultObject[oneToManyProperty];
                if (!existingOneToMany || !existingOneToMany.length) {
                    resultObject[oneToManyProperty] = currentOneToMany;
                }
                // Otherwise if the last facade doesn't match then its a new one
                else if (existingOneToMany[existingOneToMany.length - 1] !== currentMto) {
                    existingOneToMany.push(currentMto);
                }
            }
        }
        return resultObject;
    }
    flushRow() {
        this.lastRowObjectMap = this.currentRowObjectMap;
        this.currentRowObjectMap = {};
    }
}
exports.TreeResultParser = TreeResultParser;
//# sourceMappingURL=TreeResultParser.js.map