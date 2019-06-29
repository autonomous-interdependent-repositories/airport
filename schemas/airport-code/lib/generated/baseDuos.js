"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_in_1 = require("@airport/check-in");
const qSchema_1 = require("./qSchema");
// Schema Q object Dependency Injection readiness detection DAO
class SQDIDuo extends check_in_1.Duo {
    constructor(dbEntityId) {
        super(dbEntityId, qSchema_1.Q);
    }
}
exports.SQDIDuo = SQDIDuo;
class BaseSequenceDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(0);
    }
    constructor() {
        super(0);
    }
}
exports.BaseSequenceDuo = BaseSequenceDuo;
class BaseSequenceBlockDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(2);
    }
    constructor() {
        super(2);
    }
}
exports.BaseSequenceBlockDuo = BaseSequenceBlockDuo;
class BaseTerminalRunDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(1);
    }
    constructor() {
        super(1);
    }
}
exports.BaseTerminalRunDuo = BaseTerminalRunDuo;
//# sourceMappingURL=baseDuos.js.map