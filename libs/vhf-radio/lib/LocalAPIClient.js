import { container, DI } from "@airport/di";
import { OPERATION_SERIALIZER, QUERY_RESULTS_DESERIALIZER, SERIALIZATION_STATE_MANAGER } from "@airport/pressurization";
import { BroadcastChannel } from 'broadcast-channel';
import { v4 as uuidv4 } from "uuid";
import { LOCAL_API_CLIENT } from "./tokens";
let _inDemoMode = true;
export class LocalAPIClient {
    constructor() {
        this.pendingDemoMessageMap = new Map();
        this.demoListenerStarted = false;
        this.connectionReady = false;
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
                        return;
                    }
                    const messageCopy = { ...message };
                    message.__received__ = true;
                    window.parent.postMessage(messageCopy, this.clientHost);
                };
            };
        }
    }
    onMessage(callback) {
        this.messageCallback = callback;
    }
    hasValidApplicationInfo(message) {
        return typeof message.domain === 'string' && message.domain.length >= 3
            && typeof message.application === 'string' && message.application.length >= 3;
    }
    async invokeApiMethod(token, methodName, args) {
        while (!await this.isConnectionReady(token)) {
            await this.wait(100);
        }
        const [serializationStateManager, operationSerializer, queryResultsDeserializer] = await container(this).get(SERIALIZATION_STATE_MANAGER, OPERATION_SERIALIZER, QUERY_RESULTS_DESERIALIZER);
        let serializedParams;
        if (_inDemoMode) {
            serializedParams = args;
        }
        else {
            if (args) {
                if (args.length) {
                    serializedParams = args
                        .map(arg => operationSerializer.serialize(arg, serializationStateManager));
                }
                else {
                    serializedParams = [operationSerializer.serialize(args, serializationStateManager)];
                }
            }
            else {
                serializedParams = [];
            }
        }
        const request = {
            application: token.application.name,
            args: serializedParams,
            category: 'FromClient',
            domain: token.application.domain.name,
            host: window.location.host,
            id: uuidv4(),
            methodName,
            objectName: token.name,
            protocol: window.location.protocol,
        };
        let response;
        if (_inDemoMode) {
            response = await this.sendDemoRequest(request);
        }
        else {
            response = await this.sendLocalRequest(request);
        }
        if (response.errorMessage) {
            throw new Error(response.errorMessage);
        }
        if (_inDemoMode) {
            return response.payload;
        }
        else {
            return queryResultsDeserializer
                .deserialize(response.payload, serializationStateManager);
        }
    }
    wait(milliseconds) {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    }
    async isConnectionReady(token) {
        if (this.connectionReady) {
            return true;
        }
        let request = {
            application: token.application.name,
            args: [],
            category: 'IsConnectionReady',
            domain: token.application.domain.name,
            host: window.location.host,
            id: null,
            methodName: null,
            objectName: null,
            protocol: window.location.protocol,
        };
        if (_inDemoMode) {
            this.communicationChannel.postMessage(request);
            return false;
        }
        else {
            const response = await this.sendLocalRequest(request);
            if (response.errorMessage) {
                return false;
            }
            return true;
        }
    }
    async sendLocalRequest(request) {
        const httpResponse = await fetch('http://localhost:31817', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'origin',
            body: JSON.stringify(request) // body data type must match "Content-Type" header
        });
        return await httpResponse.json();
    }
    async sendDemoRequest(request) {
        if (!this.demoListenerStarted) {
            this.startDemoListener();
        }
        const returnValue = new Promise((resolve, reject) => {
            this.pendingDemoMessageMap.set(request.id, {
                request,
                resolve,
                reject
            });
        });
        this.communicationChannel.postMessage(request);
        return returnValue;
    }
    startDemoListener() {
        window.addEventListener("message", event => {
            this.handleDemoResponse(event.data);
        });
    }
    handleDemoResponse(response) {
        if (response.host !== window.location.host) {
            return;
        }
        if (response.category !== 'ToClientRedirected') {
            return;
        }
        const pendingRequest = this.pendingDemoMessageMap.get(response.id);
        if (!pendingRequest) {
            return;
        }
        if (response.errorMessage) {
            pendingRequest.reject(response.errorMessage);
        }
        else {
            pendingRequest.resolve(response);
        }
    }
}
DI.set(LOCAL_API_CLIENT, LocalAPIClient);
//# sourceMappingURL=LocalAPIClient.js.map