import {
	IEntityUpdateProperties,
	IQEntityInternal,
	MappedEntityArray,
	RawDelete,
	RawInsertValues,
	RawUpdate,
} from '@airport/air-control'
import {
	IActor,
	IRepository
} from '@airport/holding-pattern'
import { UpdateState } from '../core/UpdateState'

export interface IRepositoryManager {

	repositories: IRepository[];
	repositoriesById: { [repositoryId: string]: IRepository };

	initialize(): Promise<void>;

	createRepository(
		actor: IActor
	): Promise<IRepository>;

	getRepository(repositoryId: number): Promise<IRepository>;

	getActor(actorId: number): Promise<IActor>;

	goOffline(): void;

	getUpdateState(repository: IRepository): UpdateState;

	setUpdateStateForAll(updateState: UpdateState): void;

	setUpdateState(
		repository: IRepository,
		updateState: UpdateState
	): void;

	ensureRepositoryScopeOnInsertValues<IQE extends IQEntityInternal<any>>(
		repository: IRepository,
		rawInsertValues: RawInsertValues<IQE>
	): RawInsertValues<IQE>;

	ensureRepositoryLinkOnUpdateWhere<IEUP extends IEntityUpdateProperties, IQE extends IQEntityInternal<any>>(
		qEntity: IQEntityInternal<any>,
		repository: IRepository,
		rawUpdate: RawUpdate<IEUP, IQE>
	): RawUpdate<IEUP, IQE>;

	getOnlyRepositoryInDatabase(): IRepository;

	ensureRepositoryScopeOnDeleteWhere<IQE extends IQEntityInternal<any>>(
		qEntity: IQE,
		repository: IRepository,
		rawDelete: RawDelete<IQE>
	): RawDelete<IQE>;

}