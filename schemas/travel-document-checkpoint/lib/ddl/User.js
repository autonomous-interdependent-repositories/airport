"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const air_control_1 = require("@airport/air-control");
let User = class User {
};
__decorate([
    air_control_1.Id(),
    air_control_1.GeneratedValue(),
    air_control_1.DbNumber(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    air_control_1.Column({ name: "UNIQUE_IDENTIFIER" }),
    air_control_1.DbString(),
    __metadata("design:type", String)
], User.prototype, "uniqueId", void 0);
__decorate([
    air_control_1.Column({ name: "FIRST_NAME" }),
    air_control_1.DbString(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    air_control_1.Column({ name: "LAST_NAME" }),
    air_control_1.DbString(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    air_control_1.Column({ name: "MIDDLE_NAME" }),
    air_control_1.DbString(),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    air_control_1.DbString(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    air_control_1.OneToMany({ mappedBy: 'user' }),
    __metadata("design:type", Array)
], User.prototype, "userTerminal", void 0);
__decorate([
    air_control_1.OneToMany({ mappedBy: 'user' }),
    __metadata("design:type", Array)
], User.prototype, "userTerminalAgts", void 0);
User = __decorate([
    air_control_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map