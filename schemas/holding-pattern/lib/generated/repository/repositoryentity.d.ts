import { IStageable } from '../infrastructure/stageable';
import { IRepository } from './repository';
import { IActor } from '../infrastructure/actor';
export interface IRepositoryEntity extends IStageable {
    actorRecordId: number;
    repository: IRepository;
    actor: IActor;
    systemWideOperationId?: number;
}