import { IActor, IRecordHistory, IRootTransaction, PortableQuery } from "@airport/ground-control";
import { IOperationContext } from "../processing/OperationContext";
import { ITransaction } from "../transaction/ITransaction";

export interface IUpdateManager {

    updateValues(
        portableQuery: PortableQuery,
        actor: IActor,
        transaction: ITransaction,
        rootTransaction: IRootTransaction,
        ctx: IOperationContext
    ): Promise<number>;

}

export interface RecordHistoryMap {
    [repositoryId: number]: {
        [actorId: number]: {
            [_actorRecordId: number]: IRecordHistory
        }
    };
}
