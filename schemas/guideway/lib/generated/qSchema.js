"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const air_control_1 = require("@airport/air-control");
const check_in_1 = require("@airport/check-in");
const di_1 = require("@airport/di");
const ground_control_1 = require("@airport/ground-control");
const AgtRepositoryTransactionBlock_1 = require("../ddl/synchronization/AgtRepositoryTransactionBlock");
const AgtSharingMessage_1 = require("../ddl/synchronization/AgtSharingMessage");
const Archive_1 = require("../ddl/repository/Archive");
const DailyArchiveLog_1 = require("../ddl/archive/DailyArchiveLog");
const DailyTerminalSyncLog_1 = require("../ddl/archive/DailyTerminalSyncLog");
const MonthlyArchiveLog_1 = require("../ddl/archive/MonthlyArchiveLog");
const MonthlyTerminalSyncLog_1 = require("../ddl/archive/MonthlyTerminalSyncLog");
const Repository_1 = require("../ddl/repository/Repository");
const RepositoryArchive_1 = require("../ddl/repository/RepositoryArchive");
const SecurityAnswer_1 = require("../ddl/user/security/SecurityAnswer");
const SecurityQuestion_1 = require("../ddl/user/security/SecurityQuestion");
const Server_1 = require("../ddl/server/Server");
const ServerSyncLog_1 = require("../ddl/server/ServerSyncLog");
const SyncLog_1 = require("../ddl/synchronization/SyncLog");
const Terminal_1 = require("../ddl/terminal/Terminal");
const TerminalRepository_1 = require("../ddl/terminal/TerminalRepository");
const TuningParameters_1 = require("../ddl/tuning/TuningParameters");
const User_1 = require("../ddl/user/User");
const UserRepository_1 = require("../ddl/user/UserRepository");
const __constructors__ = {
    AgtRepositoryTransactionBlock: AgtRepositoryTransactionBlock_1.AgtRepositoryTransactionBlock,
    AgtSharingMessage: AgtSharingMessage_1.AgtSharingMessage,
    Archive: Archive_1.Archive,
    DailyArchiveLog: DailyArchiveLog_1.DailyArchiveLog,
    DailyTerminalSyncLog: DailyTerminalSyncLog_1.DailyTerminalSyncLog,
    MonthlyArchiveLog: MonthlyArchiveLog_1.MonthlyArchiveLog,
    MonthlyTerminalSyncLog: MonthlyTerminalSyncLog_1.MonthlyTerminalSyncLog,
    Repository: Repository_1.Repository,
    RepositoryArchive: RepositoryArchive_1.RepositoryArchive,
    SecurityAnswer: SecurityAnswer_1.SecurityAnswer,
    SecurityQuestion: SecurityQuestion_1.SecurityQuestion,
    Server: Server_1.Server,
    ServerSyncLog: ServerSyncLog_1.ServerSyncLog,
    SyncLog: SyncLog_1.SyncLog,
    Terminal: Terminal_1.Terminal,
    TerminalRepository: TerminalRepository_1.TerminalRepository,
    TuningParameters: TuningParameters_1.TuningParameters,
    User: User_1.User,
    UserRepository: UserRepository_1.UserRepository
};
exports.Q_SCHEMA = {
    __constructors__,
    domain: 'npmjs.org',
    name: '@airport/guideway'
};
exports.Q = exports.Q_SCHEMA;
function diSet(dbEntityId) {
    return check_in_1.diSet(exports.Q.__dbSchema__, dbEntityId);
}
exports.diSet = diSet;
function duoDiSet(dbEntityId) {
    return check_in_1.duoDiSet(exports.Q.__dbSchema__, dbEntityId);
}
exports.duoDiSet = duoDiSet;
di_1.DI.get(air_control_1.AIR_DB).then((airDb) => {
    airDb.QM[ground_control_1.getSchemaName(exports.Q_SCHEMA)] = exports.Q;
});
//# sourceMappingURL=qSchema.js.map