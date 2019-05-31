"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const air_control_1 = require("@airport/air-control");
const di_1 = require("@airport/di");
const diTokens_1 = require("./diTokens");
class QueryEntityClassCreator {
    constructor() {
        di_1.DI.get((airportDatabase, utils) => {
            this.airDb = airportDatabase;
            this.utils = utils;
        }, air_control_1.AIR_DB, air_control_1.UTILS);
    }
    createAll(schemas) {
        const schemasToCreate = air_control_1.orderSchemasInOrderOfPrecedence(schemas);
        schemasToCreate.map(dbSchema => this.create(dbSchema));
    }
    create(dbSchema) {
        let qSchema = this.airDb.QM[dbSchema.name];
        // If the Schema API source has already been loaded
        if (qSchema) {
            qSchema.__dbSchema__ = dbSchema;
        }
        else {
            qSchema = {
                __constructors__: {},
                __qConstructors__: {},
                __dbSchema__: dbSchema,
                name: dbSchema.name,
                domain: dbSchema.domain.name
            };
            this.airDb.QM[dbSchema.name] = qSchema;
        }
        this.airDb.Q[dbSchema.index] = qSchema;
        air_control_1.setQSchemaEntities(dbSchema, qSchema, this.airDb.qSchemas);
        return qSchema;
    }
}
exports.QueryEntityClassCreator = QueryEntityClassCreator;
di_1.DI.set(diTokens_1.QUERY_ENTITY_CLASS_CREATOR, QueryEntityClassCreator);
//# sourceMappingURL=QueryEntityClassCreator.js.map