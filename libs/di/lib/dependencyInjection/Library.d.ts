import { IInjectionDomain } from './System';
import { GenericDependencyInjectionError, IDiToken } from './Token';
export interface ILibrary {
    autopilot: boolean;
    name: string;
    signature: string;
    domain: IInjectionDomain;
    tokenMap: Map<string, IDiToken<any>>;
    token<T = GenericDependencyInjectionError>(name: string, autopilot?: boolean): IDiToken<T>;
}
export declare class Library implements ILibrary {
    name: string;
    domain: IInjectionDomain;
    signature: string;
    tokenMap: Map<string, IDiToken<any>>;
    autopilot: boolean;
    constructor(name: string, domain: IInjectionDomain);
    setSignature(signature: string): ILibrary;
    token<T = GenericDependencyInjectionError>(name: string): IDiToken<T>;
}
export declare function lib(libraryName: string): ILibrary;
//# sourceMappingURL=Library.d.ts.map