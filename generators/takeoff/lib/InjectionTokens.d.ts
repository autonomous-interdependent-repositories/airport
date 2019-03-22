import { Token } from 'typedi';
import { IAirportDatabasePopulator } from './AirportDatabasePopulator';
import { IDdlObjectLinker } from './DdlObjectLinker';
import { IDdlObjectRetriever } from './DdlObjectRetriever';
import { IQueryEntityClassCreator } from './QueryEntityClassCreator';
import { IQueryObjectInitializer } from './QueryObjectInitializer';
export declare const AirportDatabasePopulatorToken: Token<IAirportDatabasePopulator>;
export declare const DdlObjectLinkerToken: Token<IDdlObjectLinker>;
export declare const DdlObjectRetrieverToken: Token<IDdlObjectRetriever>;
export declare const QueryEntityClassCreatorToken: Token<IQueryEntityClassCreator>;
export declare const QueryObjectInitializerToken: Token<IQueryObjectInitializer>;