import { QSchema as AirportQSchema } from '@airport/air-control';
import { DbSchema } from '@airport/ground-control';
import { QApplication } from './qapplication';
import { QApplicationPackage } from './qapplicationpackage';
import { QDomain } from './qdomain';
import { QPackage } from './qpackage';
import { QPackagedUnit } from './qpackagedunit';
export interface LocalQSchema extends AirportQSchema {
    db: DbSchema;
    Application: QApplication;
    ApplicationPackage: QApplicationPackage;
    Domain: QDomain;
    Package: QPackage;
    PackagedUnit: QPackagedUnit;
}
export declare const Q_SCHEMA: LocalQSchema;
export declare const Q: LocalQSchema;
