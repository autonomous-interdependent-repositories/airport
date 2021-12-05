
import {
    RepositorySynchronizationMessage,
    RepositorySynchronizationReadRequest,
    RepositorySynchronizationReadResponse,
    RepositorySynchronizationWriteRequest,
    RepositorySynchronizationWriteResponse
} from '@airport/arrivals-n-departures';
import type {
    RepositoryTransactionHistory_SyncTimestamp
} from '@airport/holding-pattern';
import { DI, lib } from '@airport/di'
// import {
//     decryptString,
//     encryptString,
// } from "string-cipher";

const nonhubClient = lib('nonhub-client')
export const NONHUB_CLIENT = nonhubClient.token<INonhubClient>('INonhubClient')

export interface GetRepositoryTransactionsResult {
    messages: RepositorySynchronizationMessage[]
    syncTimestamp: number
}


export interface INonhubClient {

    getRepositoryTransactions(
        location: string,
        repositoryUuid: string,
        sinceSyncTimestamp?: number
    ): Promise<GetRepositoryTransactionsResult>

    sendRepositoryTransactions(
        location: string,
        repositoryUuId: string,
        messages: RepositorySynchronizationMessage[]
    ): Promise<RepositoryTransactionHistory_SyncTimestamp>

}

export class NonhubClient
    implements INonhubClient {

    // encryptionKey = process.env.ENCRYPTION_KEY
    serverLocationProtocol = 'http://'

    async getRepositoryTransactions(
        location: string,
        repositoryUuId: string,
        sinceSyncTimestamp: number = null
    ): Promise<GetRepositoryTransactionsResult> {
        try {
            const response = await this.sendMessage<
                RepositorySynchronizationReadRequest,
                RepositorySynchronizationReadResponse>(location, {
                    repositoryUuId,
                    syncTimestamp: sinceSyncTimestamp
                })
            if (response.error) {
                console.error(response.error)
                return {
                    messages: [],
                    syncTimestamp: 0
                }
            }
            return {
                messages: response.messages,
                syncTimestamp: response.syncTimestamp
            }
        } catch (e) {
            console.error(e)
            return {
                messages: [],
                syncTimestamp: 0
            }
        }
    }

    async sendRepositoryTransactions(
        location: string,
        repositoryUuId: string,
        messages: RepositorySynchronizationMessage[]
    ): Promise<RepositoryTransactionHistory_SyncTimestamp> {
        try {
            const response = await this.sendMessage<
                RepositorySynchronizationWriteRequest,
                RepositorySynchronizationWriteResponse
            >(location, {
                messages,
                repositoryUuId
            })
            if (response.error) {
                console.error(response.error)
                return 0
            }
            return response.syncTimestamp
        } catch (e) {
            console.error(e)
            return 0
        }

    }

    private async sendMessage<Req, Res>(
        location: string,
        request: Req
    ): Promise<Res> {
        let packagedMessage = JSON.stringify(request)
        // if (this.encryptionKey) {
        //     packagedMessage = await encryptString(
        //         packagedMessage, this.encryptionKey)
        // }
        const response = await fetch(
            this.serverLocationProtocol + location + '/read', {
            method: 'PUT',
            mode: 'cors',
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: packagedMessage // body data type must match "Content-Type" header
        })


        // let unpackagedMessage = response.text()
        // if (this.encryptionKey) {
        //     unpackagedMessage = await decryptString(unpackagedMessage, this.encryptionKey)
        // }

        // return JSON.parse(unpackagedMessage)
        return response.json()
    }

}
DI.set(NONHUB_CLIENT, NonhubClient)
