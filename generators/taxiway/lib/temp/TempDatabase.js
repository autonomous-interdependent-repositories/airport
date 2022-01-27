import { AIRPORT_DATABASE } from '@airport/air-control';
import { SEQUENCE_GENERATOR } from '@airport/check-in';
import { DI } from '@airport/di';
import { STORE_DRIVER } from '@airport/ground-control';
import { APPLICATION_BUILDER } from '@airport/landing';
import { DATABASE_MANAGER, injectTransactionalConnector, injectTransactionalServer } from '@airport/terminal';
import { APPLICATION_INITIALIZER } from '@airport/terminal-map';
import { injectAirportDatabase } from '@airport/tower';
import { NoOpApplicationBuilder } from './NoOpApplicationBuilder';
import { NoOpSequenceGenerator } from './NoOpSequenceGenerator';
import { NoOpSqlDriver } from './NoOpSqlDriver';
export class TempDatabase {
    constructor() {
        this.tempDbInitialized = false;
    }
    async initialize(applications) {
        if (this.tempDbInitialized) {
            const applicationInitializer = await DI.db().get(APPLICATION_INITIALIZER);
            await applicationInitializer.stage(applications, {});
            return;
        }
        DI.set(SEQUENCE_GENERATOR, NoOpSequenceGenerator);
        DI.set(APPLICATION_BUILDER, NoOpApplicationBuilder);
        DI.set(STORE_DRIVER, NoOpSqlDriver);
        injectAirportDatabase();
        injectTransactionalServer();
        injectTransactionalConnector();
        await DI.db().get(AIRPORT_DATABASE);
        const dbManager = await DI.db().get(DATABASE_MANAGER);
        await dbManager.initNoDb({}, ...applications);
        this.tempDbInitialized = true;
    }
}
//# sourceMappingURL=TempDatabase.js.map