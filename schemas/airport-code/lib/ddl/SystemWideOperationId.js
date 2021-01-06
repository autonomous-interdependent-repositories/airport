var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, DbNumber, Entity, Id, Table } from '@airport/air-control';
/**
 * No actual records are inserted into this table, only used for the sequence
 */
let SystemWideOperationId = class SystemWideOperationId {
};
__decorate([
    Id(),
    Column({ name: 'ID', nullable: false }),
    DbNumber()
], SystemWideOperationId.prototype, "id", void 0);
SystemWideOperationId = __decorate([
    Entity(),
    Table({ name: 'SYSTEM_WIDE_OPERATION_IDS' })
], SystemWideOperationId);
export { SystemWideOperationId };
//# sourceMappingURL=systemwideoperationid.js.map