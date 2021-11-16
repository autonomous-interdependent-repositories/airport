import { IAirportDatabase } from '@airport/air-control';
import { ITerminalStore } from '@airport/terminal-map';
import { IDomain } from '@airport/territory';
import { ISchema, ISchemaColumn, ISchemaEntity, ISchemaProperty, ISchemaPropertyColumn, ISchemaReference, ISchemaRelation, ISchemaRelationColumn, ISchemaVersion } from '@airport/traffic-pattern';
import { IDdlObjectLinker } from './DdlObjectLinker';
import { IQueryEntityClassCreator } from './QueryEntityClassCreator';
export interface IQueryObjectInitializer {
    generateQObjectsAndPopulateStore(allDdlObjects: AllDdlObjects, airDb: IAirportDatabase, ddlObjectLinker: IDdlObjectLinker, queryEntityClassCreator: IQueryEntityClassCreator, terminalStore: ITerminalStore): void;
}
export interface AllDdlObjects {
    allSchemaVersionsByIds: ISchemaVersion[];
    all: DdlObjects;
    added: DdlObjects;
}
export interface DdlObjects {
    columns: ISchemaColumn[];
    domains: IDomain[];
    entities: ISchemaEntity[];
    latestSchemaVersions: ISchemaVersion[];
    properties: ISchemaProperty[];
    propertyColumns: ISchemaPropertyColumn[];
    relationColumns: ISchemaRelationColumn[];
    relations: ISchemaRelation[];
    schemas: ISchema[];
    schemaReferences: ISchemaReference[];
    schemaVersions: ISchemaVersion[];
}
export declare class QueryObjectInitializer implements IQueryObjectInitializer {
    generateQObjectsAndPopulateStore(allDdlObjects: AllDdlObjects, airDb: IAirportDatabase, ddlObjectLinker: IDdlObjectLinker, queryEntityClassCreator: IQueryEntityClassCreator, terminalStore: ITerminalStore): void;
}
//# sourceMappingURL=QueryObjectInitializer.d.ts.map