import {
    IAutopilotApiLoader,
    IDependencyInjectionToken,
    Inject,
    Injected
} from '@airport/direction-indicator'
import { ILocalAPIClient } from '../LocalAPIClient';

@Injected()
export class AutopilotApiLoader
    implements IAutopilotApiLoader {

    @Inject()
    localApiClient: ILocalAPIClient

    loadApiAutopilot<T>(
        token: IDependencyInjectionToken<T>
    ): T {
        let localApiClient = this.localApiClient
        return new Proxy({}, {
            get(target, methodName: string) {
                switch (methodName) {
                    case '__initialized__':
                        return true
                    case 'then':
                        return target
                }
                return function (...args) {
                    return localApiClient.invokeApiMethod(
                        token, methodName, args);
                };
            }
        }) as T;
    }
}
