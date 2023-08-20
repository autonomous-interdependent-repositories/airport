import { ILastIds, JsonApplicationWithLastIds } from "@airport/air-traffic-control";
import { ICrudMessage, IInternalMessage, IResponseMessage, ISubscriptionMessage, Message_Domain } from "@airport/aviation-communication";
import {
    DbApplicationVersion,
    DbApplication_FullName,
    DbDomain,
    PortableQuery
} from "@airport/ground-control";

export interface IInitializeConnectionMessage
    extends IInternalMessage, IResponseMessage<ILastIds> {
    jsonApplication: JsonApplicationWithLastIds
}

export interface IConnectionInitializedMessage
    extends IInternalMessage {
    fullDbApplication_Name: DbApplication_FullName
}

export interface IPortableQueryMessage
    extends ICrudMessage {
    portableQuery: PortableQuery
}

export interface ISubscriptionPortableQueryMessage
    extends ISubscriptionMessage {
    portableQuery: PortableQuery
}

export interface IReadQueryMessage
    extends IPortableQueryMessage {
    repository?: {
        source: string
        GUID?: string
    }
}

export interface ISubscriptionReadQueryMessage
    extends ISubscriptionPortableQueryMessage {
    repository?: {
        source: string
        GUID?: string
    }
}

export interface IMessageDbEntity {
    _localId: number,
    _applicationVersionLocalId: number
}

export interface ISaveMessage<E, T = E | E[]>
    extends ICrudMessage {
    dbEntity: IMessageDbEntity
    entity: T
}

export interface IGetLatestApplicationVersionByDbApplication_NameMessage
    extends IInternalMessage, IResponseMessage<DbApplicationVersion> {
    fullDbApplication_Name: string
}

export interface IRetrieveDomainMessage
    extends IInternalMessage, IResponseMessage<DbDomain> {
    domainName: Message_Domain
}
