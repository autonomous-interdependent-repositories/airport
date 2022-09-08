import {
	IEntityVDescriptor,
	IVBooleanField,
	IVDateField,
	IVNumberField,
	IVStringField,
	IVUntypedField,
} from '@airbridge/validate';
import {
	RepositoryVDescriptor,
} from './vRepository';
import {
	Repository,
} from '../../ddl/repository/Repository';
import {
	ActorVDescriptor,
} from '../infrastructure/vActor';
import {
	Actor,
} from '../../ddl/infrastructure/Actor';
import {
	IAirEntity,
} from './AirEntity';



////////////////////
//  API INTERFACE //
////////////////////

export interface AirEntityVDescriptor<T>
    extends IEntityVDescriptor<T> {
	// Id Properties
	_actorRecordId?: number | IVNumberField;
	
	// Non-Id Properties
	ageSuitability?: number | IVNumberField;
	createdAt?: Date | IVDateField;
	systemWideOperationId?: number | IVNumberField;
	originalActorRecordId?: number | IVNumberField;

	// Id Relations - full property interfaces
	repository?: RepositoryVDescriptor<Repository>
	actor?: ActorVDescriptor<Actor>

  // Non-Id relations (including OneToMany's)
	originalRepository?: RepositoryVDescriptor<Repository>
	originalActor?: ActorVDescriptor<Actor>

}


