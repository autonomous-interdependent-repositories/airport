import { IRepository, IRecordHistory } from '@airport/holding-pattern';
import { ISynchronizationConflictValues } from './synchronizationconflictvalues';
export interface ISynchronizationConflict {
    id: number;
    type?: number;
    repository?: IRepository;
    overwrittenRecordHistory?: IRecordHistory;
    overwritingRecordHistory?: IRecordHistory;
    values?: ISynchronizationConflictValues[];
}