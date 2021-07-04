export declare const SCHEMA: {
    domain: string;
    index: any;
    name: string;
    packageName: string;
    sinceVersion: number;
    versions: {
        entities: ({
            columns: {
                index: number;
                isGenerated: boolean;
                manyRelationColumnRefs: {
                    manyRelationIndex: number;
                    oneSchemaIndex: number;
                    oneTableIndex: number;
                    oneColumnIndex: number;
                    sinceVersion: number;
                }[];
                name: string;
                notNull: boolean;
                propertyRefs: {
                    index: number;
                }[];
                sinceVersion: number;
                type: number;
            }[];
            idColumnRefs: {
                index: number;
            }[];
            index: number;
            isLocal: boolean;
            isRepositoryEntity: boolean;
            name: string;
            properties: ({
                columnRef: {
                    index: number;
                };
                index: number;
                isId: boolean;
                name: string;
                sinceVersion: number;
                relationRef?: undefined;
            } | {
                index: number;
                isId: boolean;
                name: string;
                relationRef: {
                    index: number;
                };
                sinceVersion: number;
                columnRef?: undefined;
            })[];
            relations: ({
                index: number;
                isId: boolean;
                relationType: number;
                propertyRef: {
                    index: number;
                };
                relationTableIndex: number;
                relationTableSchemaIndex: number;
                sinceVersion: number;
                oneToManyElems?: undefined;
            } | {
                index: number;
                isId: boolean;
                oneToManyElems: {
                    mappedBy: string;
                };
                relationType: number;
                propertyRef: {
                    index: number;
                };
                relationTableIndex: number;
                sinceVersion: number;
                relationTableSchemaIndex?: undefined;
            })[];
            sinceVersion: number;
            tableConfig: {
                name: string;
                indexes: any[];
            };
        } | {
            columns: ({
                index: number;
                isGenerated: boolean;
                manyRelationColumnRefs: {
                    manyRelationIndex: number;
                    oneSchemaIndex: number;
                    oneTableIndex: number;
                    oneColumnIndex: number;
                    sinceVersion: number;
                }[];
                name: string;
                notNull: boolean;
                propertyRefs: {
                    index: number;
                }[];
                sinceVersion: number;
                type: number;
            } | {
                index: number;
                isGenerated: boolean;
                manyRelationColumnRefs: {
                    manyRelationIndex: number;
                    oneSchemaIndex: any;
                    oneTableIndex: number;
                    oneRelationIndex: number;
                    oneColumnIndex: number;
                    sinceVersion: number;
                }[];
                name: string;
                notNull: boolean;
                propertyRefs: {
                    index: number;
                }[];
                sinceVersion: number;
                type: number;
            })[];
            idColumnRefs: {
                index: number;
            }[];
            index: number;
            isLocal: boolean;
            isRepositoryEntity: boolean;
            name: string;
            properties: ({
                columnRef: {
                    index: number;
                };
                index: number;
                isId: boolean;
                name: string;
                sinceVersion: number;
                relationRef?: undefined;
            } | {
                index: number;
                isId: boolean;
                name: string;
                relationRef: {
                    index: number;
                };
                sinceVersion: number;
                columnRef?: undefined;
            })[];
            relations: ({
                index: number;
                isId: boolean;
                relationType: number;
                propertyRef: {
                    index: number;
                };
                relationTableIndex: number;
                relationTableSchemaIndex: number;
                sinceVersion: number;
            } | {
                index: number;
                isId: boolean;
                relationType: number;
                propertyRef: {
                    index: number;
                };
                relationTableIndex: number;
                sinceVersion: number;
                relationTableSchemaIndex?: undefined;
            })[];
            sinceVersion: number;
            tableConfig: {
                name: string;
                indexes: any[];
            };
        })[];
        integerVersion: number;
        referencedSchemas: {
            domain: string;
            index: number;
            name: string;
            packageName: string;
            sinceVersion: number;
            versions: {
                entities: any;
                integerVersion: number;
                referencedSchemas: any;
                versionString: string;
            }[];
        }[];
        versionString: string;
    }[];
};
//# sourceMappingURL=schema.d.ts.map