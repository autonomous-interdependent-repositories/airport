/* eslint-disable */
import {
	Agt,
} from '../ddl/agt';
import {
	AgtESelect,
	AgtECreateColumns,
	AgtECreateProperties,
	AgtEUpdateColumns,
	AgtEUpdateProperties,
	AgtEId,
	AgtGraph,
	QAgt,
} from './qagt';
import {
	Continent,
} from '../ddl/continent';
import {
	ContinentESelect,
	ContinentECreateColumns,
	ContinentECreateProperties,
	ContinentEUpdateColumns,
	ContinentEUpdateProperties,
	ContinentEId,
	ContinentGraph,
	QContinent,
} from './qcontinent';
import {
	Country,
} from '../ddl/country';
import {
	CountryESelect,
	CountryECreateColumns,
	CountryECreateProperties,
	CountryEUpdateColumns,
	CountryEUpdateProperties,
	CountryEId,
	CountryGraph,
	QCountry,
} from './qcountry';
import {
	Terminal,
} from '../ddl/terminal';
import {
	TerminalESelect,
	TerminalECreateColumns,
	TerminalECreateProperties,
	TerminalEUpdateColumns,
	TerminalEUpdateProperties,
	TerminalEId,
	TerminalGraph,
	QTerminal,
} from './qterminal';
import {
	TerminalAgt,
} from '../ddl/terminalagt';
import {
	TerminalAgtESelect,
	TerminalAgtECreateColumns,
	TerminalAgtECreateProperties,
	TerminalAgtEUpdateColumns,
	TerminalAgtEUpdateProperties,
	TerminalAgtEId,
	TerminalAgtGraph,
	QTerminalAgt,
} from './qterminalagt';
import {
	User,
} from '../ddl/user';
import {
	UserESelect,
	UserECreateColumns,
	UserECreateProperties,
	UserEUpdateColumns,
	UserEUpdateProperties,
	UserEId,
	UserGraph,
	QUser,
} from './quser';
import {
	UserTerminal,
} from '../ddl/userterminal';
import {
	UserTerminalESelect,
	UserTerminalECreateColumns,
	UserTerminalECreateProperties,
	UserTerminalEUpdateColumns,
	UserTerminalEUpdateProperties,
	UserTerminalEId,
	UserTerminalGraph,
	QUserTerminal,
} from './quserterminal';
import {
	UserTerminalAgt,
} from '../ddl/userterminalagt';
import {
	UserTerminalAgtESelect,
	UserTerminalAgtECreateColumns,
	UserTerminalAgtECreateProperties,
	UserTerminalAgtEUpdateColumns,
	UserTerminalAgtEUpdateProperties,
	UserTerminalAgtEId,
	UserTerminalAgtGraph,
	QUserTerminalAgt,
} from './quserterminalagt';
import {
	IDao,
	IEntityCascadeGraph,
	IEntityCreateProperties,
	IEntityIdProperties,
	IEntitySelectProperties,
	IEntityUpdateColumns,
	IEntityUpdateProperties,
	IQEntity,
} from '@airport/air-traffic-control';
import {
	Dao,
	DaoQueryDecorators,
} from '@airport/check-in';
import {
	EntityId as DbEntityId,
} from '@airport/ground-control';
import {
	Q,
	duoDiSet,
} from './qApplication';


// Application Q object Dependency Injection readiness detection Dao
export class SQDIDao<Entity,
	EntitySelect extends IEntitySelectProperties,
	EntityCreate extends IEntityCreateProperties,
	EntityUpdateColumns extends IEntityUpdateColumns,
	EntityUpdateProperties extends IEntityUpdateProperties,
	EntityId extends IEntityIdProperties,
	EntityCascadeGraph extends IEntityCascadeGraph,
	IQE extends IQEntity>
	extends Dao<Entity,
		EntitySelect,
		EntityCreate,
		EntityUpdateColumns,
		EntityUpdateProperties,
		EntityId,
		EntityCascadeGraph,
		IQE> {

	constructor(
		dbEntityId: DbEntityId
	) {
		super(dbEntityId, Q)
	}
}


export interface IBaseAgtDao
  extends IDao<Agt, AgtESelect, AgtECreateProperties, AgtEUpdateColumns, AgtEUpdateProperties, AgtEId, AgtGraph, QAgt> {
}

export class BaseAgtDao
  extends SQDIDao<Agt, AgtESelect, AgtECreateProperties, AgtEUpdateColumns, AgtEUpdateProperties, AgtEId, AgtGraph, QAgt>
	implements IBaseAgtDao {
	
	static Find      = new DaoQueryDecorators<AgtESelect>();
	static FindOne   = new DaoQueryDecorators<AgtESelect>();
	static Search    = new DaoQueryDecorators<AgtESelect>();
	static SearchOne = new DaoQueryDecorators<AgtESelect>();
	static Save(
		config: AgtGraph
	): PropertyDecorator {
		return Dao.BaseSave<AgtGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(7)
	}
	
	constructor() {
		super(7)
	}
}


export interface IBaseContinentDao
  extends IDao<Continent, ContinentESelect, ContinentECreateProperties, ContinentEUpdateColumns, ContinentEUpdateProperties, ContinentEId, ContinentGraph, QContinent> {
}

export class BaseContinentDao
  extends SQDIDao<Continent, ContinentESelect, ContinentECreateProperties, ContinentEUpdateColumns, ContinentEUpdateProperties, ContinentEId, ContinentGraph, QContinent>
	implements IBaseContinentDao {
	
	static Find      = new DaoQueryDecorators<ContinentESelect>();
	static FindOne   = new DaoQueryDecorators<ContinentESelect>();
	static Search    = new DaoQueryDecorators<ContinentESelect>();
	static SearchOne = new DaoQueryDecorators<ContinentESelect>();
	static Save(
		config: ContinentGraph
	): PropertyDecorator {
		return Dao.BaseSave<ContinentGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(0)
	}
	
	constructor() {
		super(0)
	}
}


export interface IBaseCountryDao
  extends IDao<Country, CountryESelect, CountryECreateProperties, CountryEUpdateColumns, CountryEUpdateProperties, CountryEId, CountryGraph, QCountry> {
}

export class BaseCountryDao
  extends SQDIDao<Country, CountryESelect, CountryECreateProperties, CountryEUpdateColumns, CountryEUpdateProperties, CountryEId, CountryGraph, QCountry>
	implements IBaseCountryDao {
	
	static Find      = new DaoQueryDecorators<CountryESelect>();
	static FindOne   = new DaoQueryDecorators<CountryESelect>();
	static Search    = new DaoQueryDecorators<CountryESelect>();
	static SearchOne = new DaoQueryDecorators<CountryESelect>();
	static Save(
		config: CountryGraph
	): PropertyDecorator {
		return Dao.BaseSave<CountryGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(1)
	}
	
	constructor() {
		super(1)
	}
}


export interface IBaseTerminalDao
  extends IDao<Terminal, TerminalESelect, TerminalECreateProperties, TerminalEUpdateColumns, TerminalEUpdateProperties, TerminalEId, TerminalGraph, QTerminal> {
}

export class BaseTerminalDao
  extends SQDIDao<Terminal, TerminalESelect, TerminalECreateProperties, TerminalEUpdateColumns, TerminalEUpdateProperties, TerminalEId, TerminalGraph, QTerminal>
	implements IBaseTerminalDao {
	
	static Find      = new DaoQueryDecorators<TerminalESelect>();
	static FindOne   = new DaoQueryDecorators<TerminalESelect>();
	static Search    = new DaoQueryDecorators<TerminalESelect>();
	static SearchOne = new DaoQueryDecorators<TerminalESelect>();
	static Save(
		config: TerminalGraph
	): PropertyDecorator {
		return Dao.BaseSave<TerminalGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(5)
	}
	
	constructor() {
		super(5)
	}
}


export interface IBaseTerminalAgtDao
  extends IDao<TerminalAgt, TerminalAgtESelect, TerminalAgtECreateProperties, TerminalAgtEUpdateColumns, TerminalAgtEUpdateProperties, TerminalAgtEId, TerminalAgtGraph, QTerminalAgt> {
}

export class BaseTerminalAgtDao
  extends SQDIDao<TerminalAgt, TerminalAgtESelect, TerminalAgtECreateProperties, TerminalAgtEUpdateColumns, TerminalAgtEUpdateProperties, TerminalAgtEId, TerminalAgtGraph, QTerminalAgt>
	implements IBaseTerminalAgtDao {
	
	static Find      = new DaoQueryDecorators<TerminalAgtESelect>();
	static FindOne   = new DaoQueryDecorators<TerminalAgtESelect>();
	static Search    = new DaoQueryDecorators<TerminalAgtESelect>();
	static SearchOne = new DaoQueryDecorators<TerminalAgtESelect>();
	static Save(
		config: TerminalAgtGraph
	): PropertyDecorator {
		return Dao.BaseSave<TerminalAgtGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(6)
	}
	
	constructor() {
		super(6)
	}
}


export interface IBaseUserDao
  extends IDao<User, UserESelect, UserECreateProperties, UserEUpdateColumns, UserEUpdateProperties, UserEId, UserGraph, QUser> {
}

export class BaseUserDao
  extends SQDIDao<User, UserESelect, UserECreateProperties, UserEUpdateColumns, UserEUpdateProperties, UserEId, UserGraph, QUser>
	implements IBaseUserDao {
	
	static Find      = new DaoQueryDecorators<UserESelect>();
	static FindOne   = new DaoQueryDecorators<UserESelect>();
	static Search    = new DaoQueryDecorators<UserESelect>();
	static SearchOne = new DaoQueryDecorators<UserESelect>();
	static Save(
		config: UserGraph
	): PropertyDecorator {
		return Dao.BaseSave<UserGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(4)
	}
	
	constructor() {
		super(4)
	}
}


export interface IBaseUserTerminalDao
  extends IDao<UserTerminal, UserTerminalESelect, UserTerminalECreateProperties, UserTerminalEUpdateColumns, UserTerminalEUpdateProperties, UserTerminalEId, UserTerminalGraph, QUserTerminal> {
}

export class BaseUserTerminalDao
  extends SQDIDao<UserTerminal, UserTerminalESelect, UserTerminalECreateProperties, UserTerminalEUpdateColumns, UserTerminalEUpdateProperties, UserTerminalEId, UserTerminalGraph, QUserTerminal>
	implements IBaseUserTerminalDao {
	
	static Find      = new DaoQueryDecorators<UserTerminalESelect>();
	static FindOne   = new DaoQueryDecorators<UserTerminalESelect>();
	static Search    = new DaoQueryDecorators<UserTerminalESelect>();
	static SearchOne = new DaoQueryDecorators<UserTerminalESelect>();
	static Save(
		config: UserTerminalGraph
	): PropertyDecorator {
		return Dao.BaseSave<UserTerminalGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(2)
	}
	
	constructor() {
		super(2)
	}
}


export interface IBaseUserTerminalAgtDao
  extends IDao<UserTerminalAgt, UserTerminalAgtESelect, UserTerminalAgtECreateProperties, UserTerminalAgtEUpdateColumns, UserTerminalAgtEUpdateProperties, UserTerminalAgtEId, UserTerminalAgtGraph, QUserTerminalAgt> {
}

export class BaseUserTerminalAgtDao
  extends SQDIDao<UserTerminalAgt, UserTerminalAgtESelect, UserTerminalAgtECreateProperties, UserTerminalAgtEUpdateColumns, UserTerminalAgtEUpdateProperties, UserTerminalAgtEId, UserTerminalAgtGraph, QUserTerminalAgt>
	implements IBaseUserTerminalAgtDao {
	
	static Find      = new DaoQueryDecorators<UserTerminalAgtESelect>();
	static FindOne   = new DaoQueryDecorators<UserTerminalAgtESelect>();
	static Search    = new DaoQueryDecorators<UserTerminalAgtESelect>();
	static SearchOne = new DaoQueryDecorators<UserTerminalAgtESelect>();
	static Save(
		config: UserTerminalAgtGraph
	): PropertyDecorator {
		return Dao.BaseSave<UserTerminalAgtGraph>(config);
  }

	static diSet(): boolean {
		return duoDiSet(3)
	}
	
	constructor() {
		super(3)
	}
}
