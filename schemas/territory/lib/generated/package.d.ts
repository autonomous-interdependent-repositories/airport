import { IApplicationPackage } from './applicationpackage';
export interface IPackage {
    id: number;
    name?: string;
    applicationPackages?: IApplicationPackage[];
}
