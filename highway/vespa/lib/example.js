var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Y } from '@airport/air-control';
import { Document } from '@airport/hw-control';
import { vespa } from './impl/AccessPoint';
export class Factor {
}
export class Thread {
}
let VespaThread = class VespaThread {
    constructor() {
        this.name = vespa.type.string(Thread, {
            name: '',
        });
    }
};
__decorate([
    Document({
        test: 'hello',
    })
], VespaThread.prototype, "data", void 0);
__decorate([
    vespa.Attribute({
        fastSearch: true,
    }),
    vespa.Indexing({
        index: Y,
    })
], VespaThread.prototype, "name", void 0);
VespaThread = __decorate([
    vespa.Entity()
], VespaThread);
let Default = class Default {
};
Default = __decorate([
    vespa.Default(),
    vespa.Fieldset(Thread, {
        fields: {
            name: Y,
        },
    })
], Default);
//# sourceMappingURL=example.js.map