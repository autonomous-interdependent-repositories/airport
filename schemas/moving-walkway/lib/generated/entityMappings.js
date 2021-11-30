/* eslint-disable */
import { AIRPORT_DATABASE } from '@airport/air-control';
import { DI } from '@airport/di';
import { SynchronizationConflictValues } from '../ddl/conflict/SynchronizationConflictValues';
import { SynchronizationConflict } from '../ddl/conflict/SynchronizationConflict';
import { SynchronizationConflictPendingNotification } from '../ddl/conflict/SynchronizationConflictPendingNotification';
import { RecordUpdateStage } from '../ddl/RecordUpdateStage';
DI.db().get(AIRPORT_DATABASE).then(airDb => {
    const accumulator = airDb.getAccumulator('air', 'moving-walkway');
    accumulator.add(SynchronizationConflictValues, 0);
    accumulator.add(SynchronizationConflict, 1);
    accumulator.add(SynchronizationConflictPendingNotification, 2);
    accumulator.add(RecordUpdateStage, 3);
});
//# sourceMappingURL=entityMappings.js.map