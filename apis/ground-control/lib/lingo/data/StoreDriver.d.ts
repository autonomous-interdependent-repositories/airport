import { IObservable } from "@airport/observe";
import { PortableQuery } from "../query/PortableQuery";
import { StoreType } from "./storeInfo";
/**
 * Created by Papa on 6/10/2016.
 */
export declare enum QueryType {
    DDL = 0,
    SELECT = 1,
    MUTATE = 2
}
export interface ATransactionHistory {
}
export declare const INVALID_TABLE_NAME = "A0ZA2vKHIAeI9506rYzCSFKYcSbSuLy5sRieHPnd2NevufFEx9CxuZsAdXieZBbRj5mPYypr3TGYwb6limMcTTWHOnsk7F6991890";
export interface IStoreDriver {
    type: StoreType;
    deleteWhere(portableQuery: PortableQuery): Promise<number>;
    find<E, EntityArray extends Array<E>>(portableQuery: PortableQuery, cachedSqlQueryId?: number): Promise<EntityArray>;
    findOne<E>(portableQuery: PortableQuery, cachedSqlQueryId?: number): Promise<E>;
    findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    initialize(dbName: string): Promise<any>;
    insertValues(portableQuery: PortableQuery, cachedSqlQueryId?: number): Promise<number>;
    query(queryType: QueryType, query: string, params: any, saveTransaction?: boolean): Promise<any>;
    saveTransaction(transaction: ATransactionHistory): Promise<any>;
    search<E, EntityArray extends Array<E>>(portableQuery: PortableQuery, cachedSqlQueryId?: number): IObservable<EntityArray>;
    searchOne<E>(portableQuery: PortableQuery, cachedSqlQueryId?: number): IObservable<E>;
    updateWhere(portableQuery: PortableQuery): Promise<number>;
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
}
