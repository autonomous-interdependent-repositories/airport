var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, DbString, Entity, GeneratedValue, Id, JoinColumn, ManyToOne, OneToMany, SequenceGenerator, Table } from '@airport/air-control';
/**
 * Marks a group of mutation history changes.
 */
let OperationHistory = class OperationHistory {
    constructor() {
        this.recordHistory = [];
    }
};
__decorate([
    GeneratedValue(),
    SequenceGenerator({ allocationSize: 600 }),
    Id()
], OperationHistory.prototype, "id", void 0);
__decorate([
    ManyToOne(),
    JoinColumn({
        name: 'REPOSITORY_TRANSACTION_HISTORY_ID', referencedColumnName: 'ID',
        nullable: false
    })
], OperationHistory.prototype, "repositoryTransactionHistory", void 0);
__decorate([
    Column({ name: 'ORDER_NUMBER', nullable: false })
], OperationHistory.prototype, "orderNumber", void 0);
__decorate([
    Column({ name: 'CHANGE_TYPE', nullable: false }),
    DbString()
], OperationHistory.prototype, "changeType", void 0);
__decorate([
    Column({ name: 'SYSTEM_WIDE_OPERATION_ID', nullable: false })
], OperationHistory.prototype, "systemWideOperationId", void 0);
__decorate([
    ManyToOne(),
    JoinColumn({ name: 'ENTITY_ID', referencedColumnName: 'ID', nullable: false })
], OperationHistory.prototype, "entity", void 0);
__decorate([
    OneToMany({ mappedBy: 'operationHistory' })
], OperationHistory.prototype, "recordHistory", void 0);
OperationHistory = __decorate([
    Entity(),
    Table({ name: 'REPOSITORY_OPERATION_HISTORY' })
], OperationHistory);
export { OperationHistory };
//# sourceMappingURL=OperationHistory.js.map