import {
	and,
	Y
}                         from '@airport/air-control'
import {DI}               from '@airport/di'
import {ensureChildJsSet} from '@airport/ground-control'
import {QTerminal}        from '@airport/travel-document-checkpoint'
import {
	ActorId,
	Repository_Id
}                         from '../../ddl/ddl'
import {REPOSITORY_ACTOR_DAO}   from '../../tokens'
import {
	BaseRepositoryActorDao,
	IBaseRepositoryActorDao,
	IRepositoryActor,
	Q,
	QActor,
	QRepositoryActor,
}                         from '../../generated/generated'

export interface IRepositoryActorDao
	extends IBaseRepositoryActorDao {

	findAllForLocalActorsWhereRepositoryIdIn(
		repositoryIds: Repository_Id[]
	): Promise<IRepositoryActor[]>;

	findActorIdMapByRepositoryIdForLocalActorsWhereRepositoryIdIn(
		repositoryIds: Repository_Id[]
	): Promise<Map<Repository_Id, Set<ActorId>>>;

}

export class RepositoryActorDao
	extends BaseRepositoryActorDao
	implements IRepositoryActorDao {

	async findAllForLocalActorsWhereRepositoryIdIn(
		repositoryIds: Repository_Id[]
	): Promise<IRepositoryActor[]> {
		let ra: QRepositoryActor,
		    a: QActor,
		    d: QTerminal
		const id = Y

		return await this.db.find.tree({
			select: {
				repository: {
					id
				},
				actor: {
					id
				}
			},
			from: [
				ra = Q.RepositoryActor,
				a = ra.actor.innerJoin(),
				d = a.terminal.innerJoin()
			],
			where: and(
				ra.repository.id.in(repositoryIds),
				d.isLocal.equals(true)
			)
		})
	}

	async findActorIdMapByRepositoryIdForLocalActorsWhereRepositoryIdIn(
		repositoryIds: Repository_Id[]
	): Promise<Map<Repository_Id, Set<ActorId>>> {
		const records = await this.findAllForLocalActorsWhereRepositoryIdIn(repositoryIds)

		const actorIdMapByRepositoryId: Map<Repository_Id, Set<ActorId>> = new Map()

		for (const record of records) {
			ensureChildJsSet(actorIdMapByRepositoryId, record.repository.id)
				.add(record.actor.id)
		}

		return actorIdMapByRepositoryId
	}

}

DI.set(REPOSITORY_ACTOR_DAO, RepositoryActorDao)
