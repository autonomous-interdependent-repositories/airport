export interface ITransactionLog {
    repositoryId: string
    actorId: string
    log: string
}

export interface Request {
    senderUuid: string
    uuid: string
}

export interface RepositoryReadRequest {
    repositoryId: string
    sinceTime: number
}

export interface ReadRequest
    extends Request {
    reads: RepositoryReadRequest[]
}

export interface SearchRequest
    extends Request {
    searchTerm: string
}

export interface UserRequest
    extends Request {
    username: string
}

export interface WriteRequest
    extends Request {
    category: 'FromClient'
}
