import { IChildContainer } from "./IChildContainer";
import { IContainer } from "./IContainer";
export interface IRootContainer extends IContainer {
    isFramework: boolean;
    db(id?: string): IChildContainer;
    ui(componentName: string): IChildContainer;
    remove(container: IChildContainer): void;
}
//# sourceMappingURL=IRootContainer.d.ts.map