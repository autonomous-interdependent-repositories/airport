import { IDomain } from '@airport/territory';
import { ISchemaVersion } from './schemaversion';
export interface ISchema {
    index: number;
    scope?: string;
    name?: string;
    status?: number;
    domain?: IDomain;
    versions?: ISchemaVersion[];
    currentVersion?: ISchemaVersion;
}
