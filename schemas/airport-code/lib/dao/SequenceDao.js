import { plus } from '@airport/air-control';
import { DI } from '@airport/di';
import { SEQUENCE_DAO } from '../tokens';
import { BaseSequenceDao, Q } from '../generated/generated';
export class SequenceDao extends BaseSequenceDao {
    static diSet() {
        return Q.__dbApplication__ && Q.__dbApplication__.currentVersion[0]
            .applicationVersion.entities[0];
    }
    async incrementCurrentValues() {
        const s = Q.Sequence;
        await this.db.updateWhere({
            update: s,
            set: {
                currentValue: plus(s.currentValue, s.incrementBy)
            }
        });
    }
    async incrementSequence() {
        const s = Q.Sequence;
        await this.db.updateWhere({
            update: s,
            set: {
                currentValue: plus(s.currentValue, s.incrementBy)
            }
        });
    }
}
DI.set(SEQUENCE_DAO, SequenceDao);
//# sourceMappingURL=SequenceDao.js.map