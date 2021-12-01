import { AIRPORT_DATABASE } from '@airport/air-control';
import { diSet as dS, duoDiSet as ddS } from '@airport/check-in';
import { DI } from '@airport/di';
import { getApplicationName } from '@airport/ground-control';
import { Application, ApplicationColumn, ApplicationCurrentVersion, ApplicationEntity, ApplicationOperation, ApplicationProperty, ApplicationPropertyColumn, ApplicationReference, ApplicationRelation, ApplicationRelationColumn, ApplicationVersion, Domain, VersionedApplicationObject } from '../ddl/ddl';
const __constructors__ = {
    Application: Application,
    ApplicationColumn: ApplicationColumn,
    ApplicationCurrentVersion: ApplicationCurrentVersion,
    ApplicationEntity: ApplicationEntity,
    ApplicationOperation: ApplicationOperation,
    ApplicationProperty: ApplicationProperty,
    ApplicationPropertyColumn: ApplicationPropertyColumn,
    ApplicationReference: ApplicationReference,
    ApplicationRelation: ApplicationRelation,
    ApplicationRelationColumn: ApplicationRelationColumn,
    ApplicationVersion: ApplicationVersion,
    Domain: Domain,
    VersionedApplicationObject: VersionedApplicationObject
};
export const Q_APPLICATION = {
    __constructors__,
    domain: 'air',
    name: '@airport/airspace'
};
export const Q = Q_APPLICATION;
export function diSet(dbEntityId) {
    return dS(Q.__dbApplication__, dbEntityId);
}
export function duoDiSet(dbEntityId) {
    return ddS(Q.__dbApplication__, dbEntityId);
}
DI.db().eventuallyGet(AIRPORT_DATABASE).then((airDb) => {
    airDb.QM[getApplicationName(Q_APPLICATION)] = Q;
});
//# sourceMappingURL=qApplication.js.map