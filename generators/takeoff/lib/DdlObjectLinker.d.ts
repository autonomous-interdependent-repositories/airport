import { ITerminalStore } from '@airport/terminal-map';
import { DdlObjects } from './QueryObjectInitializer';
export interface IDdlObjectLinker {
    link(ddlObjects: DdlObjects, terminalStore: ITerminalStore): void;
}
export declare class DdlObjectLinker implements IDdlObjectLinker {
    link(ddlObjects: DdlObjects, terminalStore: ITerminalStore): void;
    private linkDomainsAndSchemasAndVersions;
    private linkEntities;
    private linkPropertiesAndRelations;
    private linkColumns;
}
