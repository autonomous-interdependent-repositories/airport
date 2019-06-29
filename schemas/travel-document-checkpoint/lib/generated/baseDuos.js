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
class BaseAgtDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(5);
    }
    constructor() {
        super(5);
    }
}
exports.BaseAgtDuo = BaseAgtDuo;
class BaseTerminalDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(3);
    }
    constructor() {
        super(3);
    }
}
exports.BaseTerminalDuo = BaseTerminalDuo;
class BaseTerminalAgtDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(4);
    }
    constructor() {
        super(4);
    }
}
exports.BaseTerminalAgtDuo = BaseTerminalAgtDuo;
class BaseUserDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(2);
    }
    constructor() {
        super(2);
    }
}
exports.BaseUserDuo = BaseUserDuo;
class BaseUserTerminalDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(0);
    }
    constructor() {
        super(0);
    }
}
exports.BaseUserTerminalDuo = BaseUserTerminalDuo;
class BaseUserTerminalAgtDuo extends SQDIDuo {
    static diSet() {
        return qSchema_1.diSet(1);
    }
    constructor() {
        super(1);
    }
}
exports.BaseUserTerminalAgtDuo = BaseUserTerminalAgtDuo;
//# sourceMappingURL=baseDuos.js.map