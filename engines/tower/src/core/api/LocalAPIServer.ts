import {
    ILocalAPIRequest,
    ILocalAPIResponse
} from "@airport/aviation-communication";
import { IApiRegistry } from "@airport/check-in";
import {
    DEPENDENCY_INJECTION
} from "@airport/direction-indicator";
import {
    ILocalAPIServer,
    LOCAL_API_SERVER
} from "@airport/security-check";


export class LocalAPIServer
    implements ILocalAPIServer {

    apiRegistry: IApiRegistry

    async handleRequest(
        request: ILocalAPIRequest
    ): Promise<ILocalAPIResponse> {

        let payload
        let errorMessage: string
        try {
            const {
                apiObject,
                apiOperation
            } = await this.apiRegistry.findApiObjectAndOperation(
                request.domain, request.application, request.objectName, request.methodName)
            const result = apiObject[request.methodName].apply(apiObject, request.args)
            if (apiOperation.isAsync) {
                payload = await result
            } else {
                payload = result
            }
        } catch (e) {
            errorMessage = e.message
            console.error(e)
        }

        const response: ILocalAPIResponse = {
            application: request.application,
            category: 'ToClient',
            domain: request.domain,
            errorMessage,
            id: request.id,
            methodName: request.methodName,
            objectName: request.objectName,
            protocol: request.protocol,
            payload,
        }

        return response
    }


}
DEPENDENCY_INJECTION.set(LOCAL_API_SERVER, LocalAPIServer)
