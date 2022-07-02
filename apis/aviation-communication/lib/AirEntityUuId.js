var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injected } from '@airport/direction-indicator';
let AirEntityUtils = class AirEntityUtils {
    getCreatedBy(airEntity) {
        return airEntity.actor.user;
    }
    encodeUuId(idObject) {
        if (!idObject.repository
            || !idObject.repository.GUID
            || !idObject.actor
            || !idObject.actor.GUID
            || !idObject.actorRecordId) {
            return null;
        }
        if (typeof idObject.repository.GUID !== 'string') {
            throw Error(`Type of "repository.uuId" property is not a string.`);
        }
        if (typeof idObject.actor.GUID !== 'string') {
            throw Error(`Type of "actor.uuId" property is not a string.`);
        }
        if (typeof idObject.actorRecordId !== 'number') {
            throw Error(`Type of "actorRecordId" property is not a number.`);
        }
        return idObject.repository.GUID + '-' + idObject.actor.GUID + '-' + idObject.actorRecordId;
    }
    parseEGUID(idString) {
        const idStringFragments = idString.split('-');
        if (idStringFragments.length !== 11) {
            throw new Error('Invalid Entity GUID, expecting ${repository.uuId}-${actor.uuId}-${actorRecordId}');
        }
        const repositoryUuIdFragments = [];
        for (let i = 0; i < 5; i++) {
            repositoryUuIdFragments.push(idStringFragments[i]);
        }
        const actorUuIdFragments = [];
        for (let i = 5; i < 10; i++) {
            actorUuIdFragments.push(idStringFragments[i]);
        }
        return {
            repository: {
                GUID: repositoryUuIdFragments.join('-')
            },
            actor: {
                GUID: actorUuIdFragments.join('-')
            },
            actorRecordId: parseInt(idStringFragments[11])
        };
    }
    setUuId(idString, airEntity) {
        let airEntityId = this.parseEGUID(idString);
        if (!airEntity.repository) {
            airEntity.repository = {
                GUID: airEntityId.repository.GUID
            };
        }
        else {
            airEntity.repository.GUID = airEntityId.repository.GUID;
        }
        if (!airEntity.actor) {
            airEntity.actor = {
                GUID: airEntityId.repository.GUID
            };
        }
        else {
            airEntity.actor.GUID = airEntityId.actor.GUID;
        }
        airEntity.actorRecordId = airEntityId.actorRecordId;
    }
};
AirEntityUtils = __decorate([
    Injected()
], AirEntityUtils);
export { AirEntityUtils };
//# sourceMappingURL=AirEntityUuId.js.map