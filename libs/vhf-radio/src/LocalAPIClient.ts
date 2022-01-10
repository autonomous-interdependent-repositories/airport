import {
    ILocalAPIRequest,
    ILocalAPIResponse
} from "@airport/aviation-communcation";
import { container, DI, IDiToken } from "@airport/di";
import {
    OPERATION_SERIALIZER,
    QUERY_RESULTS_DESERIALIZER,
    SERIALIZATION_STATE_MANAGER
} from "@airport/pressurization";
import { BroadcastChannel } from 'broadcast-channel';
import { v4 as uuidv4 } from "uuid";
import { LOCAL_API_CLIENT } from "./tokens";

export interface ILocalAPIClient {

    invokeApiMethod<T = any>(
        token: IDiToken<T>,
        methodName: string,
        args: any[]
    ): Promise<void>

    onMessage(callback: (
        message: any
    ) => void)

}

let _inDemoMode = true
export interface IRequestRecord {
    request: ILocalAPIRequest
    reject
    resolve
}

export class LocalAPIClient
    implements ILocalAPIClient {

    pendingDemoMessageMap: Map<string, IRequestRecord> = new Map();

    demoListenerStarted = false;

    connectionReady = false

    communicationChannel

    messageCallback: (
        message: any
    ) => void

    constructor() {

        if (_inDemoMode) {
            const createChannel = () => {
                this.communicationChannel = new BroadcastChannel('clientCommunication', {
                    idb: {
                        onclose: () => {
                            // the onclose event is just the IndexedDB closing.
                            // you should also close the channel before creating
                            // a new one.
                            this.communicationChannel.close();
                            createChannel();
                        },
                    },
                });

                this.communicationChannel.onmessage = message => {
                    if (message.__received__) {
                        return
                    }
                    const messageCopy = { ...message }
                    message.__received__ = true

                    window.parent.postMessage(messageCopy, this.clientHost)
                };
            }

        }
    }

    onMessage(callback: (
        message: any
    ) => void) {
        this.messageCallback = callback
    }

    private hasValidApplicationInfo(
        message: ILocalAPIResponse
    ) {
        return typeof message.domain === 'string' && message.domain.length >= 3
            && typeof message.application === 'string' && message.application.length >= 3
    }

    async invokeApiMethod<T>(
        token: IDiToken<T>,
        methodName: string,
        args: any[]
    ): Promise<any> {
        while (!await this.isConnectionReady(token)) {
            await this.wait(100)
        }

        const [serializationStateManager, operationSerializer, queryResultsDeserializer]
            = await container(this).get(SERIALIZATION_STATE_MANAGER,
                OPERATION_SERIALIZER, QUERY_RESULTS_DESERIALIZER)

        let serializedParams
        if (_inDemoMode) {
            serializedParams = args
        } else {
            if (args) {
                if (args.length) {
                    serializedParams = args
                        .map(arg => operationSerializer.serialize(arg, serializationStateManager))
                } else {
                    serializedParams = [operationSerializer.serialize(args, serializationStateManager)]
                }
            } else {
                serializedParams = []
            }
        }

        const request: ILocalAPIRequest = {
            application: token.application.name,
            args: serializedParams,
            category: 'FromClient',
            domain: token.application.domain.name,
            host: window.location.host,
            id: uuidv4(),
            methodName,
            objectName: token.name,
            protocol: window.location.protocol,
        }

        let response: ILocalAPIResponse

        if (_inDemoMode) {
            response = await this.sendDemoRequest(request)
        } else {
            response = await this.sendLocalRequest(request)
        }

        if (response.errorMessage) {
            throw new Error(response.errorMessage)
        }

        if (_inDemoMode) {
            return response.payload
        } else {
            return queryResultsDeserializer
                .deserialize(response.payload, serializationStateManager)
        }
    }

    private wait(
        milliseconds: number
    ): Promise<void> {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve()
            }, milliseconds)
        })
    }

    private async isConnectionReady<T>(
        token: IDiToken<T>
    ): Promise<boolean> {
        if (this.connectionReady) {
            return true
        }
        let request: ILocalAPIRequest = {
            application: token.application.name,
            args: [],
            category: 'IsConnectionReady',
            domain: token.application.domain.name,
            host: window.location.host,
            id: null,
            methodName: null,
            objectName: null,
            protocol: window.location.protocol,
        }

        if (_inDemoMode) {
            this.communicationChannel.postMessage(request)
            return false
        } else {
            const response = await this.sendLocalRequest(request)

            if (response.errorMessage) {
                return false
            }
            return true
        }
    }

    private async sendLocalRequest(
        request: ILocalAPIRequest
    ): Promise<ILocalAPIResponse> {
        const httpResponse = await fetch('http://localhost:31817', {
            method: 'PUT',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(request) // body data type must match "Content-Type" header
        })

        return await httpResponse.json()
    }

    private async sendDemoRequest(
        request: ILocalAPIRequest
    ): Promise<ILocalAPIResponse> {
        if (!this.demoListenerStarted) {
            this.startDemoListener()
        }
        const returnValue = new Promise<ILocalAPIResponse>((resolve, reject) => {
            this.pendingDemoMessageMap.set(request.id, {
                request,
                resolve,
                reject
            })
        })
        this.communicationChannel.postMessage(request)

        return returnValue
    }

    private startDemoListener() {
        window.addEventListener("message", event => {
            this.handleDemoResponse(event.data);
        })
    }

    private handleDemoResponse(
        response: ILocalAPIResponse
    ) {
        if (response.host !== window.location.host) {
            return
        }
        if (response.category !== 'ToClientRedirected') {
            return
        }
        const pendingRequest = this.pendingDemoMessageMap.get(response.id)
        if (!pendingRequest) {
            return
        }
        if (response.errorMessage) {
            pendingRequest.reject(response.errorMessage)
        } else {
            pendingRequest.resolve(response)
        }
    }

}
DI.set(LOCAL_API_CLIENT, LocalAPIClient)
