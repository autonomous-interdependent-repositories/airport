import { IImmutableRow } from './immutablerow';
export interface IMutableRow extends IImmutableRow {
    updatedAt?: Date;
}
