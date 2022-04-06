import { ApplicationName, DomainName } from '@airport/ground-control';
import { TmTerminal_Id, User_Id } from '@airport/travel-document-checkpoint-internal';
import { Actor_Id, Actor_UuId } from '../../ddl/ddl';
import { BaseActorDao, IActor, IBaseActorDao } from '../../generated/generated';
export interface IActorDao extends IBaseActorDao {
    findWithDetailsAndGlobalIdsByIds(actorIds: Actor_Id[]): Promise<IActor[]>;
    findWithDetailsByGlobalIds(uuIds: Actor_UuId[], userIds: User_Id[], terminalIds: TmTerminal_Id[]): Promise<IActor[]>;
    findMapsWithDetailsByGlobalIds(uuIds: Actor_UuId[], userIds: User_Id[], terminalIds: TmTerminal_Id[], actorMap: Map<User_Id, Map<TmTerminal_Id, IActor>>, actorMapById: Map<Actor_Id, IActor>): Promise<void>;
    findByDomainAndApplicationNames(domainName: DomainName, applicationName: ApplicationName): Promise<IActor[]>;
    findByUuIds(uuIds: Actor_UuId[]): Promise<IActor[]>;
    insert(actors: IActor[]): Promise<void>;
}
export declare class ActorDao extends BaseActorDao implements IActorDao {
    findWithDetailsAndGlobalIdsByIds(actorIds: Actor_Id[]): Promise<IActor[]>;
    findMapsWithDetailsByGlobalIds(uuIds: Actor_UuId[], userIds: User_Id[], terminalIds: TmTerminal_Id[], actorMap: Map<User_Id, Map<TmTerminal_Id, IActor>>, actorMapById: Map<Actor_Id, IActor>): Promise<void>;
    findWithDetailsByGlobalIds(uuIds: Actor_UuId[], userIds: User_Id[], terminalIds: TmTerminal_Id[]): Promise<IActor[]>;
    findByDomainAndApplicationNames(domainName: DomainName, applicationName: ApplicationName): Promise<IActor[]>;
    findByUuIds(uuIds: Actor_UuId[]): Promise<IActor[]>;
    insert(actors: IActor[]): Promise<void>;
    private findWithDetailsAndGlobalIdsByWhereClause;
}
//# sourceMappingURL=ActorDao.d.ts.map