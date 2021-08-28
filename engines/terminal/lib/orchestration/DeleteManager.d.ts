import { IContext } from '@airport/di';
import { PortableQuery } from '@airport/ground-control';
import { IActor } from '@airport/holding-pattern';
import { IDeleteManager, ITransaction } from '@airport/terminal-map';
export declare class DeleteManager implements IDeleteManager {
    deleteWhere(portableQuery: PortableQuery, actor: IActor, transaction: ITransaction, context?: IContext): Promise<number>;
    private recordRepositoryIds;
    private columnProcessed;
    private recordTreeToDelete;
    private getCascadeSubTree;
}
//# sourceMappingURL=DeleteManager.d.ts.map