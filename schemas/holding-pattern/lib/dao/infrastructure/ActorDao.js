import { ALL_FIELDS, and, Y } from '@airport/air-control';
import { DI } from '@airport/di';
import { ensureChildJsMap } from '@airport/ground-control';
import { ACTOR_DAO } from '../../tokens';
import { BaseActorDao, Q } from '../../generated/generated';
export class ActorDao extends BaseActorDao {
    async findWithDetailsAndGlobalIdsByIds(actorIds) {
        return await this.findWithDetailsAndGlobalIdsByWhereClause((a) => a.id.in(actorIds));
    }
    async findMapsWithDetailsByGlobalIds(uuIds, userIds, terminalIds, actorMap, actorMapById) {
        const actors = await this.findWithDetailsByGlobalIds(uuIds, userIds, terminalIds);
        for (const actor of actors) {
            ensureChildJsMap(actorMap, actor.user.id)
                .set(actor.terminal.id, actor);
            actorMapById.set(actor.id, actor);
        }
    }
    async findWithDetailsByGlobalIds(uuIds, userIds, terminalIds) {
        return await this.findWithDetailsAndGlobalIdsByWhereClause((a) => and(a.uuId.in(uuIds), a.terminal.id.in(terminalIds), a.user.id.in(userIds)));
    }
    async findByApplicationSignature(applicationSignature) {
        let act;
        let application;
        let terminal;
        let user;
        return await this.db.find.tree({
            select: {
                id: Y,
                application: {},
                terminal: {},
                user: {},
                uuId: Y
            },
            from: [
                act = Q.Actor,
                application = act.application.innerJoin(),
                terminal = act.terminal.leftJoin(),
                user = act.user.leftJoin()
            ],
            where: application.signature.equals(applicationSignature)
        });
    }
    async findByUuIds(uuIds) {
        let a;
        return await this.db.find.tree({
            select: {},
            from: [
                a = Q.Actor
            ],
            where: a.uuId.in(uuIds)
        });
    }
    async insert(actors) {
        let t;
        const values = [];
        for (const actor of actors) {
            values.push([
                actor.uuId, actor.application.index, actor.user.id, actor.terminal.id,
            ]);
        }
        const ids = await this.db.insertValuesGenerateIds({
            insertInto: t = Q.Actor,
            columns: [
                t.uuId,
                t.application.index,
                t.user.id,
                t.terminal.id
            ],
            values
        });
        for (let i = 0; i < actors.length; i++) {
            let actor = actors[i];
            actor.id = ids[i][0];
        }
    }
    async findWithDetailsAndGlobalIdsByWhereClause(getWhereClause) {
        let a;
        let ap;
        let t;
        const id = Y;
        const username = Y;
        const uuId = Y;
        return await this.db.find.tree({
            select: {
                ...ALL_FIELDS,
                application: {
                    index: Y,
                    name: Y,
                    domain: {
                        name: Y
                    }
                },
                terminal: {
                    id,
                    uuId,
                    owner: {
                        id,
                        username,
                        uuId,
                    }
                },
                user: {
                    id,
                    username,
                    uuId,
                }
            },
            from: [
                a = Q.Actor,
                ap = a.application.leftJoin(),
                ap.domain.leftJoin(),
                t = a.terminal.leftJoin(),
                t.owner.leftJoin(),
                a.user.leftJoin()
            ],
            where: getWhereClause(a)
        });
    }
}
DI.set(ACTOR_DAO, ActorDao);
//# sourceMappingURL=ActorDao.js.map