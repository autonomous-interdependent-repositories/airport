import {
	and,
	Y
}                  from '@airport/air-control'
import {DI}        from '@airport/di'
import {
	ensureChildJsMap,
	JSONBaseOperation
}                  from '@airport/ground-control'
import {
	QUser,
	TmTerminalId,
	UserId
}                  from '@airport/travel-document-checkpoint'
import {
	ActorId,
	ActorRandomId,
}                  from '../../ddl/ddl'
import {ACTOR_DAO} from '../../diTokens'
import {
	BaseActorDao,
	IActor,
	IBaseActorDao,
	Q,
	QActor,
}                  from '../../generated/generated'

export interface IActorDao
	extends IBaseActorDao {

	findWithDetailsAndGlobalIdsByIds(
		actorIds: ActorId[]
	): Promise<IActor[]>;

	findWithDetailsByGlobalIds(
		randomIds: ActorRandomId[],
		userIds: UserId[],
		terminalIds: TmTerminalId[]
	): Promise<IActor[]>;

	findMapsWithDetailsByGlobalIds(
		randomIds: ActorRandomId[],
		userIds: UserId[],
		terminalIds: TmTerminalId[],
		actorMap: Map<UserId, Map<TmTerminalId, IActor>>,
		actorMapById: Map<ActorId, IActor>
	): Promise<void>;

}

export class ActorDao
	extends BaseActorDao
	implements IActorDao {

	async findWithDetailsAndGlobalIdsByIds(
		actorIds: ActorId[]
	): Promise<IActor[]> {
		return await this.findWithDetailsAndGlobalIdsByWhereClause((
			a: QActor,
		) => a.id.in(actorIds))
	}

	async findMapsWithDetailsByGlobalIds(
		randomIds: ActorRandomId[],
		userIds: UserId[],
		terminalIds: TmTerminalId[],
		actorMap: Map<UserId, Map<TmTerminalId, IActor>>,
		actorMapById: Map<ActorId, IActor>
	): Promise<void> {
		const actors = await this.findWithDetailsByGlobalIds(
			randomIds,
			userIds,
			terminalIds
		)

		for (const actor of actors) {
			ensureChildJsMap(actorMap, actor.user.id)
				.set(actor.terminal.id, actor)
			actorMapById.set(actor.id, actor)
		}
	}

	async findWithDetailsByGlobalIds(
		randomIds: ActorRandomId[],
		userIds: UserId[],
		terminalIds: TmTerminalId[]
	): Promise<IActor[]> {
		return await this.findWithDetailsAndGlobalIdsByWhereClause((
			a: QActor
		) => and(
			a.randomId.in(randomIds),
			a.terminal.id.in(terminalIds),
			a.user.id.in(userIds)
		))
	}

	private async findWithDetailsAndGlobalIdsByWhereClause(
		getWhereClause: (
			a: QActor
		) => JSONBaseOperation
	): Promise<IActor[]> {
		let a: QActor
		let u: QUser
		const id = Y
		return await this.db.find.tree({
			select: {
				id,
				randomId: Y,
				user: {
					id,
				},
				terminal: {
					id
				}
			},
			from: [
				a = Q.Actor
			],
			where: getWhereClause(a)
		})
	}
}

DI.set(ACTOR_DAO, ActorDao)
