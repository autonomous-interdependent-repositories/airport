export interface IContext {
    repository?: {
        source: string;
        uuId?: string;
    };
    startedAt?: Date;
    [propertyName: string]: any;
}
export interface IInjectionContext extends IContext {
    inAIRportApp?: boolean;
    name: string;
    type: ContextType;
}
export declare enum ContextType {
    DB = "DB",
    UI = "UI"
}
export declare class Context implements IInjectionContext {
    name: string;
    type: ContextType;
    constructor(name: string, type: ContextType);
}
//# sourceMappingURL=Context.d.ts.map