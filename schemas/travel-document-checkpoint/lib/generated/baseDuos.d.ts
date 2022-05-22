import { Agt } from '../ddl/agt';
import { AgtESelect, AgtECreateProperties, AgtEUpdateColumns, AgtEUpdateProperties, AgtEId, AgtGraph, QAgt } from './qagt';
import { Continent } from '../ddl/continent';
import { ContinentESelect, ContinentECreateProperties, ContinentEUpdateColumns, ContinentEUpdateProperties, ContinentEId, ContinentGraph, QContinent } from './qcontinent';
import { Country } from '../ddl/country';
import { CountryESelect, CountryECreateProperties, CountryEUpdateColumns, CountryEUpdateProperties, CountryEId, CountryGraph, QCountry } from './qcountry';
import { Terminal } from '../ddl/terminal';
import { TerminalESelect, TerminalECreateProperties, TerminalEUpdateColumns, TerminalEUpdateProperties, TerminalEId, TerminalGraph, QTerminal } from './qterminal';
import { TerminalAgt } from '../ddl/terminalagt';
import { TerminalAgtESelect, TerminalAgtECreateProperties, TerminalAgtEUpdateColumns, TerminalAgtEUpdateProperties, TerminalAgtEId, TerminalAgtGraph, QTerminalAgt } from './qterminalagt';
import { User } from '../ddl/user';
import { UserESelect, UserECreateProperties, UserEUpdateColumns, UserEUpdateProperties, UserEId, UserGraph, QUser } from './quser';
import { UserTerminal } from '../ddl/userterminal';
import { UserTerminalESelect, UserTerminalECreateProperties, UserTerminalEUpdateColumns, UserTerminalEUpdateProperties, UserTerminalEId, UserTerminalGraph, QUserTerminal } from './quserterminal';
import { UserTerminalAgt } from '../ddl/userterminalagt';
import { UserTerminalAgtESelect, UserTerminalAgtECreateProperties, UserTerminalAgtEUpdateColumns, UserTerminalAgtEUpdateProperties, UserTerminalAgtEId, UserTerminalAgtGraph, QUserTerminalAgt } from './quserterminalagt';
import { IDuo, IEntityCascadeGraph, IEntityCreateProperties, IEntityIdProperties, IEntitySelectProperties, IEntityUpdateColumns, IEntityUpdateProperties, IQEntity } from '@airport/air-traffic-control';
import { Duo } from '@airport/check-in';
import { EntityId as DbEntityId } from '@airport/ground-control';
export declare class SQDIDuo<Entity, EntitySelect extends IEntitySelectProperties, EntityCreate extends IEntityCreateProperties, EntityUpdateColumns extends IEntityUpdateColumns, EntityUpdateProperties extends IEntityUpdateProperties, EntityId extends IEntityIdProperties, EntityCascadeGraph extends IEntityCascadeGraph, IQE extends IQEntity> extends Duo<Entity, EntitySelect, EntityCreate, EntityUpdateColumns, EntityUpdateProperties, EntityId, EntityCascadeGraph, IQE> {
    constructor(dbEntityId: DbEntityId);
}
export interface IBaseAgtDuo extends IDuo<Agt, AgtESelect, AgtECreateProperties, AgtEUpdateColumns, AgtEUpdateProperties, AgtEId, AgtGraph, QAgt> {
}
export declare class BaseAgtDuo extends SQDIDuo<Agt, AgtESelect, AgtECreateProperties, AgtEUpdateColumns, AgtEUpdateProperties, AgtEId, AgtGraph, QAgt> implements IBaseAgtDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseContinentDuo extends IDuo<Continent, ContinentESelect, ContinentECreateProperties, ContinentEUpdateColumns, ContinentEUpdateProperties, ContinentEId, ContinentGraph, QContinent> {
}
export declare class BaseContinentDuo extends SQDIDuo<Continent, ContinentESelect, ContinentECreateProperties, ContinentEUpdateColumns, ContinentEUpdateProperties, ContinentEId, ContinentGraph, QContinent> implements IBaseContinentDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseCountryDuo extends IDuo<Country, CountryESelect, CountryECreateProperties, CountryEUpdateColumns, CountryEUpdateProperties, CountryEId, CountryGraph, QCountry> {
}
export declare class BaseCountryDuo extends SQDIDuo<Country, CountryESelect, CountryECreateProperties, CountryEUpdateColumns, CountryEUpdateProperties, CountryEId, CountryGraph, QCountry> implements IBaseCountryDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseTerminalDuo extends IDuo<Terminal, TerminalESelect, TerminalECreateProperties, TerminalEUpdateColumns, TerminalEUpdateProperties, TerminalEId, TerminalGraph, QTerminal> {
}
export declare class BaseTerminalDuo extends SQDIDuo<Terminal, TerminalESelect, TerminalECreateProperties, TerminalEUpdateColumns, TerminalEUpdateProperties, TerminalEId, TerminalGraph, QTerminal> implements IBaseTerminalDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseTerminalAgtDuo extends IDuo<TerminalAgt, TerminalAgtESelect, TerminalAgtECreateProperties, TerminalAgtEUpdateColumns, TerminalAgtEUpdateProperties, TerminalAgtEId, TerminalAgtGraph, QTerminalAgt> {
}
export declare class BaseTerminalAgtDuo extends SQDIDuo<TerminalAgt, TerminalAgtESelect, TerminalAgtECreateProperties, TerminalAgtEUpdateColumns, TerminalAgtEUpdateProperties, TerminalAgtEId, TerminalAgtGraph, QTerminalAgt> implements IBaseTerminalAgtDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseUserDuo extends IDuo<User, UserESelect, UserECreateProperties, UserEUpdateColumns, UserEUpdateProperties, UserEId, UserGraph, QUser> {
}
export declare class BaseUserDuo extends SQDIDuo<User, UserESelect, UserECreateProperties, UserEUpdateColumns, UserEUpdateProperties, UserEId, UserGraph, QUser> implements IBaseUserDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseUserTerminalDuo extends IDuo<UserTerminal, UserTerminalESelect, UserTerminalECreateProperties, UserTerminalEUpdateColumns, UserTerminalEUpdateProperties, UserTerminalEId, UserTerminalGraph, QUserTerminal> {
}
export declare class BaseUserTerminalDuo extends SQDIDuo<UserTerminal, UserTerminalESelect, UserTerminalECreateProperties, UserTerminalEUpdateColumns, UserTerminalEUpdateProperties, UserTerminalEId, UserTerminalGraph, QUserTerminal> implements IBaseUserTerminalDuo {
    static diSet(): boolean;
    constructor();
}
export interface IBaseUserTerminalAgtDuo extends IDuo<UserTerminalAgt, UserTerminalAgtESelect, UserTerminalAgtECreateProperties, UserTerminalAgtEUpdateColumns, UserTerminalAgtEUpdateProperties, UserTerminalAgtEId, UserTerminalAgtGraph, QUserTerminalAgt> {
}
export declare class BaseUserTerminalAgtDuo extends SQDIDuo<UserTerminalAgt, UserTerminalAgtESelect, UserTerminalAgtECreateProperties, UserTerminalAgtEUpdateColumns, UserTerminalAgtEUpdateProperties, UserTerminalAgtEId, UserTerminalAgtGraph, QUserTerminalAgt> implements IBaseUserTerminalAgtDuo {
    static diSet(): boolean;
    constructor();
}
//# sourceMappingURL=baseDuos.d.ts.map