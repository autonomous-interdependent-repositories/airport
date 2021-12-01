import { IVersionedApplicationObject } from './versionedapplicationobject';
import { IApplicationColumn } from './applicationcolumn';
import { IApplicationRelation } from './applicationrelation';
export interface IApplicationRelationColumn extends IVersionedApplicationObject {
    id: number;
    manyColumn?: IApplicationColumn;
    oneColumn?: IApplicationColumn;
    manyRelation?: IApplicationRelation;
    oneRelation?: IApplicationRelation;
    parentRelation?: IApplicationRelation;
}
//# sourceMappingURL=applicationrelationcolumn.d.ts.map