import { AIRPORT_DATABASE } from '@airport/air-control';
import { DI } from '@airport/di';
import { getFullApplicationName } from '@airport/ground-control';
const __constructors__ = {};
export const Q_APPLICATION = {
    __constructors__,
    domain: 'air',
    name: '@airport/travel-document-checkpoint'
};
export const Q = Q_APPLICATION;
DI.db().eventuallyGet(AIRPORT_DATABASE).then((airDb) => {
    airDb.QM[getFullApplicationName(Q_APPLICATION)] = Q;
});
//# sourceMappingURL=qApiApplication.js.map