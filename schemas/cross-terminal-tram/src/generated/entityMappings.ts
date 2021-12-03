/* eslint-disable */
import { AIRPORT_DATABASE } from '@airport/air-control';
import { DI } from '@airport/di';
import { SynchronizationConflictValues } from '../ddl/conflict/SynchronizationConflictValues';
import { SynchronizationConflict } from '../ddl/conflict/SynchronizationConflict';
import { SynchronizationConflictPendingNotification } from '../ddl/conflict/SynchronizationConflictPendingNotification';
import { MissingRecord } from '../ddl/missingRecord/MissingRecord';
import { SharingNodeRepoTransBlock } from '../ddl/sharingNode/SharingNodeRepoTransBlock';
import { SharingNode } from '../ddl/sharingNode/SharingNode';
import { SharingMessage } from '../ddl/sharingMessage/SharingMessage';
import { SharingMessageRepoTransBlock } from '../ddl/sharingMessage/SharingMessageRepoTransBlock';
import { RepoTransBlockApplicationToChange } from '../ddl/repositoryTransactionBlock/RepoTransBlockApplicationToChange';
import { RepositoryTransactionBlock } from '../ddl/repositoryTransactionBlock/RepositoryTransactionBlock';
import { MissingRecordRepoTransBlock } from '../ddl/missingRecord/MissingRecordRepoTransBlock';
import { RepositoryTransactionHistoryUpdateStage } from '../ddl/repositoryTransactionBlock/RepositoryTransactionHistoryUpdateStage';
import { RepoTransBlockResponseStage } from '../ddl/repositoryTransactionBlock/RepoTransBlockResponseStage';
import { SharingNodeTerminal } from '../ddl/sharingNode/SharingNodeTerminal';
import { SharingNodeRepository } from '../ddl/sharingNode/SharingNodeRepository';
import { SharingNodeRepoTransBlockStage } from '../ddl/sharingNode/SharingNodeRepoTransBlockStage';
import { RecordUpdateStage } from '../ddl/RecordUpdateStage';

DI.db().get(AIRPORT_DATABASE).then(airDb => {
  const accumulator = airDb.getAccumulator('air', 'moving-walkway');
  accumulator.add(SynchronizationConflictValues, 0);
  accumulator.add(SynchronizationConflict, 1);
  accumulator.add(SynchronizationConflictPendingNotification, 2);
  accumulator.add(MissingRecord, 3);
  accumulator.add(SharingNodeRepoTransBlock, 4);
  accumulator.add(SharingNode, 5);
  accumulator.add(SharingMessage, 6);
  accumulator.add(SharingMessageRepoTransBlock, 7);
  accumulator.add(RepoTransBlockApplicationToChange, 8);
  accumulator.add(RepositoryTransactionBlock, 9);
  accumulator.add(MissingRecordRepoTransBlock, 10);
  accumulator.add(RepositoryTransactionHistoryUpdateStage, 11);
  accumulator.add(RepoTransBlockResponseStage, 12);
  accumulator.add(SharingNodeTerminal, 13);
  accumulator.add(SharingNodeRepository, 14);
  accumulator.add(SharingNodeRepoTransBlockStage, 15);
  accumulator.add(RecordUpdateStage, 16);
});