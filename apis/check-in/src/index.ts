export * from './dao/Dao';
export * from './dao/DaoDecorators';
export * from './dao/DaoFindOneStub';
export * from './dao/DaoFindStub';
export * from './dao/DaoQueryDecorators';
export * from './dao/DaoSearchOneStub';
export * from './dao/DaoSearchStub';
export * from './dao/DaoStub';
export * from './clientQuery/ClientQuery';
export * from './serialize/OperationDeserializer';
export * from './serialize/QueryParameterDeserializer';
export * from './serialize/QueryResultsSerializer';
export * from './api/Api';
export * from './api/ApiOperation'
export * from './api/ApiRegistry'
export * from './api/ApiValidator'
export * from './api/JsonApplicationWithApi'
export * from './Duo';
export * from './EntityDatabaseFacade';
export * from './Selector';
export * from './SequenceGenerator';
export * from './tokens';

import { airApi } from '@airport/aviation-communication'
import { diSet, duoDiSet } from './SequenceGenerator';
airApi.dS = diSet
airApi.ddS = duoDiSet
