import { IRecordHistory } from './recordhistory';
export interface IRecordHistoryOldValue {
    columnIndex: number;
    recordHistory: IRecordHistory;
    oldValue?: any;
}
