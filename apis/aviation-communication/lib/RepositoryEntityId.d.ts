export interface RepositoryEntityId {
    repository: {
        id?: number;
        uuId?: string;
    };
    actor: {
        id?: number;
        uuId?: string;
        user?: {
            username: string;
        };
    };
    actorRecordId: number;
}
export interface IRepositoryEntityUtils {
    getCreatedBy(idObject: RepositoryEntityId): string;
    encodeId(idObject: RepositoryEntityId): string;
    parseId(idString: string): RepositoryEntityId;
    setId(idString: string, repositoryEntity: RepositoryEntityId): void;
}
export declare class RepositoryEntityUtils implements IRepositoryEntityUtils {
    getCreatedBy(repositoryEntity: RepositoryEntityId): string;
    encodeId(idObject: RepositoryEntityId): string;
    parseId(idString: string): RepositoryEntityId;
    setId(idString: string, repositoryEntity: RepositoryEntityId): void;
}
//# sourceMappingURL=RepositoryEntityId.d.ts.map