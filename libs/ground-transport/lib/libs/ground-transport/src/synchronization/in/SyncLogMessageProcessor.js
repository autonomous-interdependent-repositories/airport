"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const air_control_1 = require("@airport/air-control");
const moving_walkway_1 = require("@airport/moving-walkway");
const DataOrigin_1 = require("@airport/moving-walkway/lib/ddl/values/DataOrigin");
const InjectionTokens_1 = require("@airport/moving-walkway/lib/InjectionTokens");
const SyncStatus_1 = require("@airport/terminal-map/lib/sync/SyncStatus");
const typedi_1 = require("typedi");
const Inject_1 = require("typedi/decorators/Inject");
const InjectionTokens_2 = require("../../InjectionTokens");
let SyncLogMessageProcessor = class SyncLogMessageProcessor {
    constructor(sharingMessageDao, 
    // @Inject(SharingMessageResponseStageDaoToken)
    // private sharingMessageResponseStageDao: ISharingMessageResponseStageDao,
    sharingNodeRepoTransBlockDao, sharingNodeRepoTransBlockStageDao, repositoryTransactionBlockDao, repoTransBlockResponseStageDao, utils) {
        this.sharingMessageDao = sharingMessageDao;
        this.sharingNodeRepoTransBlockDao = sharingNodeRepoTransBlockDao;
        this.sharingNodeRepoTransBlockStageDao = sharingNodeRepoTransBlockStageDao;
        this.repositoryTransactionBlockDao = repositoryTransactionBlockDao;
        this.repoTransBlockResponseStageDao = repoTransBlockResponseStageDao;
        this.utils = utils;
    }
    /**
     *
     * Record Synchronization Log messages coming from AGT (messages replying back with status
     * of sync logs sent from this TM).
     *
     * @param {ISyncLogToTM[]} syncLogMessages   Sync log messages from AGT
     * @returns {Promise<void>}
     */
    async recordSyncLogMessages(syncLogMessages) {
        if (!syncLogMessages.length) {
            return;
        }
        const { repoTransBlockIdSet, repoTransBlockResponseStageValues, repoTransBlockSyncOutcomeMapBySharingNodeId, 
        // sharingMessageResponseStageValues,
        sharingNodeIdSet } = this.generateSyncLogDataStructures(syncLogMessages);
        // All of the SharingNodeRepoTransBlocks should already exist
        // They were created on the sync out to AGT
        await this.updateExistingSharingNodeRepoTransBlocks(sharingNodeIdSet, repoTransBlockIdSet, repoTransBlockSyncOutcomeMapBySharingNodeId);
        // If for some reason they don't insert them
        await this.insertNewSharingNodeRepoTransBlocks(repoTransBlockSyncOutcomeMapBySharingNodeId);
        // Update SharingMessages with data from AGT
        // await this.sharingMessageResponseStageDao.insertValues(sharingMessageResponseStageValues);
        // await this.sharingMessageDao.updateFromResponseStage();
        // await this.sharingMessageResponseStageDao.delete();
        // Update RepoTransBlocks with data from AGT
        await this.repoTransBlockResponseStageDao.insertValues(repoTransBlockResponseStageValues);
        await this.repositoryTransactionBlockDao.updateFromResponseStage();
        await this.repoTransBlockResponseStageDao.delete();
    }
    generateSyncLogDataStructures(syncLogMessages) {
        // const sharingMessageResponseStageValues: SharingMessageResponseStageValues[] = [];
        let repoTransBlockResponseStageValues = [];
        const sharingNodeIdSet = new Set();
        const repoTransBlockIdSet = new Set();
        const repoTransBlockSyncOutcomeMapBySharingNodeId = new Map();
        for (const syncLogMessage of syncLogMessages) {
            // sharingMessageResponseStageValues.push([
            // 	syncLogMessage.tmSharingMessageId,
            // 	syncLogMessage.agtTerminalSyncLogId,
            // 	syncLogMessage.syncDatetime
            // ]);
            const sharingNodeId = syncLogMessage.sharingNode.id;
            sharingNodeIdSet.add(sharingNodeId);
            for (const outcome of syncLogMessage.outcomes) {
                const tmRepositoryTransactionBlockId = outcome[0];
                repoTransBlockIdSet.add(tmRepositoryTransactionBlockId);
                this.utils.ensureChildJsMap(repoTransBlockSyncOutcomeMapBySharingNodeId, sharingNodeId)
                    .set(tmRepositoryTransactionBlockId, outcome);
            }
            repoTransBlockResponseStageValues
                = repoTransBlockResponseStageValues.concat(syncLogMessage.outcomes);
        }
        return {
            repoTransBlockIdSet,
            repoTransBlockResponseStageValues,
            repoTransBlockSyncOutcomeMapBySharingNodeId,
            // sharingMessageResponseStageValues,
            sharingNodeIdSet
        };
    }
    async updateExistingSharingNodeRepoTransBlocks(sharingNodeIdSet, repoTransBlockIdSet, repoTransBlockSyncOutcomeMapBySharingNodeId) {
        const existingSharingNodeRepoTransBlockMap = await this.sharingNodeRepoTransBlockDao
            .findMapBySharingNodeIdWhereSharingNodeIdInAndRepoTransBlockIdIn(Array.from(sharingNodeIdSet), Array.from(repoTransBlockIdSet));
        const sharingNodeTransBlockStageValues = [];
        for (const [sharingNodeId, repoTransBlocksForSharingNodeById] of existingSharingNodeRepoTransBlockMap) {
            const repoTransBlockSyncOutcomesForSharingNodeId = repoTransBlockSyncOutcomeMapBySharingNodeId.get(sharingNodeId);
            for (const [tmRepositoryTransactionBlockId, repositoryTransactionBlock] of repoTransBlocksForSharingNodeById) {
                const repoTransBlockSyncOutcome = repoTransBlockSyncOutcomesForSharingNodeId.get(tmRepositoryTransactionBlockId);
                repoTransBlockSyncOutcomesForSharingNodeId.delete(tmRepositoryTransactionBlockId);
                sharingNodeTransBlockStageValues.push([
                    sharingNodeId,
                    tmRepositoryTransactionBlockId,
                    repoTransBlockSyncOutcome.syncOutcomeType
                ]);
            }
        }
        await this.sharingNodeRepoTransBlockStageDao.insertValues(sharingNodeTransBlockStageValues);
        await this.sharingNodeRepoTransBlockDao.updateFromResponseStage();
        await this.sharingNodeRepoTransBlockStageDao.delete();
    }
    async insertNewSharingNodeRepoTransBlocks(repoTransBlockSyncOutcomeMapBySharingNodeId) {
        const sharingNodeTransBlockValues = [];
        const sharingMessageSyncTimestamp = new Date();
        for (const [sharingNodeId, repoTransBlockSyncOutcomesForSharingNodeId] of repoTransBlockSyncOutcomeMapBySharingNodeId) {
            for (const [tmRepositoryTransactionBlockId, repoTransBlockSyncOutcome] of repoTransBlockSyncOutcomesForSharingNodeId) {
                sharingNodeTransBlockValues.push([
                    sharingNodeId,
                    tmRepositoryTransactionBlockId,
                    sharingMessageSyncTimestamp,
                    repoTransBlockSyncOutcome.syncOutcomeType,
                    DataOrigin_1.DataOrigin.LOCAL,
                    SyncStatus_1.BlockSyncStatus.SYNCHRONIZED
                ]);
            }
        }
        await this.sharingNodeRepoTransBlockDao.insertValues(sharingNodeTransBlockValues);
    }
};
SyncLogMessageProcessor = __decorate([
    typedi_1.Service(InjectionTokens_2.SyncLogMessageProcessorToken),
    __param(0, Inject_1.Inject(moving_walkway_1.SharingMessageDaoToken)),
    __param(1, Inject_1.Inject(moving_walkway_1.SharingNodeRepoTransBlockDaoToken)),
    __param(2, Inject_1.Inject(moving_walkway_1.SharingNodeRepoTransBlockStageDaoToken)),
    __param(3, Inject_1.Inject(InjectionTokens_1.RepositoryTransactionBlockDaoToken)),
    __param(4, Inject_1.Inject(InjectionTokens_1.RepoTransBlockResponseStageDaoToken)),
    __param(5, Inject_1.Inject(air_control_1.UtilsToken)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], SyncLogMessageProcessor);
exports.SyncLogMessageProcessor = SyncLogMessageProcessor;
//# sourceMappingURL=SyncLogMessageProcessor.js.map