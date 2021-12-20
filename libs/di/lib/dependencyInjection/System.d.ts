import { ILibrary } from './InjectionApplication';
export interface IInjectionDomain {
    name: string;
    app(libraryName: string): ILibrary;
    getApp(libraryName: string): ILibrary;
    getAppBySignature(signature: string): ILibrary;
    mapApplicationBySignature(libraryName: string, signature: string): void;
}
export declare class InjectionDomain implements IInjectionDomain {
    name: string;
    private applicationMap;
    private applicationMapBySignature;
    constructor(name: string);
    app(libraryName: string): ILibrary;
    getApp(libraryName: string): ILibrary;
    getAppBySignature(signature: string): ILibrary;
    mapApplicationBySignature(libraryName: string, signature: string): void;
}
export declare function domain(domainName: string): IInjectionDomain;
export declare const AIRPORT_DOMAIN: IInjectionDomain;
//# sourceMappingURL=System.d.ts.map