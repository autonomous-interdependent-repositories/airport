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
const TestD_1 = require("./TestD");
const TestE_1 = require("./TestE");
// TODO: add support for TS interfaces on non-id based relations
let TestF = class TestF {
};
__decorate([
    air_control_1.Id(),
    __metadata("design:type", Number)
], TestF.prototype, "fOne", void 0);
__decorate([
    air_control_1.Id(),
    air_control_1.ManyToOne(),
    air_control_1.JoinColumns([
        { name: 'D_ONE' },
        { name: 'D_TWO' }
    ]),
    __metadata("design:type", TestD_1.TestD)
], TestF.prototype, "d", void 0);
__decorate([
    air_control_1.Id(),
    air_control_1.ManyToOne(),
    air_control_1.JoinColumns([
        { name: 'D_ONE' },
        { name: 'D_TWO' },
        { name: 'E_ONE' }
    ]),
    __metadata("design:type", TestE_1.TestE
    // @Column({name: 'D_TWO'})
    // dTwo: number
    // @Id()
    // @ManyToOne()
    // @JoinColumn({name: 'E_ONE'})
    // e: TestE
    )
], TestF.prototype, "e", void 0);
TestF = __decorate([
    air_control_1.Entity(),
    air_control_1.Table({ name: 'TEST_F' })
], TestF);
exports.TestF = TestF;
//# sourceMappingURL=TestF.js.map