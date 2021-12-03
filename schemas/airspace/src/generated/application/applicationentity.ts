import {
	IVersionedApplicationObject,
} from './versionedapplicationobject';
import {
	TableConfiguration,
} from '@airport/air-control';
import {
	IApplicationColumn,
} from './applicationcolumn';
import {
	IApplicationProperty,
} from './applicationproperty';
import {
	IApplicationVersion,
} from './applicationversion';
import {
	IApplicationOperation,
} from './applicationoperation';
import {
	IApplicationRelation,
} from './applicationrelation';



//////////////////////////////
//     ENTITY INTERFACE     //
//////////////////////////////

export interface IApplicationEntity extends IVersionedApplicationObject {
	
	// Id Properties
	id: number;

	// Id Relations

	// Non-Id Properties
	index?: number;
	isLocal?: boolean;
	isRepositoryEntity?: boolean;
	name?: string;
	tableConfig?: TableConfiguration;

	// Non-Id Relations
	applicationVersion?: IApplicationVersion;
	columns?: IApplicationColumn[];
	operations?: IApplicationOperation[];
	properties?: IApplicationProperty[];
	relations?: IApplicationRelation[];
	relationReferences?: IApplicationRelation[];

	// Transient Properties
	columnMap?: { [name: string]: IApplicationColumn; };
	idColumns?: IApplicationColumn[];
	idColumnMap?: { [name: string]: IApplicationColumn; };
	propertyMap?: { [name: string]: IApplicationProperty; };

	// Public Methods
	
}

