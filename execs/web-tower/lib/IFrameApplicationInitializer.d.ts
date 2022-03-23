import { FullApplicationName } from "@airport/ground-control";
import { ApplicationInitializer } from "@airport/landing";
import { IApplicationInitializer } from "@airport/terminal-map";
export interface IIFrameApplicationInitializer extends IApplicationInitializer {
}
export declare class IFrameApplicationInitializer extends ApplicationInitializer {
    applicationWindowMap: Map<FullApplicationName, Window>;
    nativeInitializeApplication(domain: string, application: string, fullApplicationName: string): Promise<void>;
}
//# sourceMappingURL=IFrameApplicationInitializer.d.ts.map