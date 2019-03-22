"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@airport/di");
const diTokens_1 = require("../../diTokens");
const generated_1 = require("../../generated/generated");
class SynchronizationConflictValuesDao extends generated_1.BaseSynchronizationConflictValuesDao {
}
exports.SynchronizationConflictValuesDao = SynchronizationConflictValuesDao;
di_1.DI.set(diTokens_1.SYNC_CONFLICT_VALUES_DAO, SynchronizationConflictValuesDao);
//# sourceMappingURL=SynchronizationConflictValuesDao.js.map