"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ground_control_1 = require("@airport/ground-control");
/**
 * Created by Papa on 5/28/2016.
 */
function getStoreDriver(storeType) {
    switch (storeType) {
        case ground_control_1.StoreType.SQLITE_CORDOVA:
            let WebSqlDriverClass = require('./webSql/WebSqlDriver').WebSqlDriver;
            return new WebSqlDriverClass();
        case ground_control_1.StoreType.SQLJS:
            let SqlJsDriverClass = require('./sqlJs/SqlJsDriver').SqlJsDriver;
            return new SqlJsDriverClass();
        default:
            throw `Unsupported StoreType: ${storeType}`;
    }
}
exports.getStoreDriver = getStoreDriver;
//# sourceMappingURL=Store.js.map