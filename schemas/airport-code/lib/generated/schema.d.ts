export declare const SCHEMA: {
    "domain": string;
    "index": any;
    "name": string;
    "sinceVersion": number;
    "versions": {
        "entities": {
            "columns": ({
                "allocationSize": number;
                "index": number;
                "isGenerated": boolean;
                "manyRelationColumnRefs": any[];
                "name": string;
                "notNull": boolean;
                "propertyRefs": {
                    "index": number;
                }[];
                "sinceVersion": number;
                "type": number;
            } | {
                "index": number;
                "isGenerated": boolean;
                "manyRelationColumnRefs": {
                    "manyRelationIndex": number;
                    "oneSchemaIndex": any;
                    "oneTableIndex": number;
                    "oneColumnIndex": number;
                    "sinceVersion": number;
                }[];
                "name": string;
                "notNull": boolean;
                "propertyRefs": {
                    "index": number;
                }[];
                "sinceVersion": number;
                "type": number;
                "allocationSize"?: undefined;
            })[];
            "idColumnRefs": {
                "index": number;
            }[];
            "index": number;
            "isLocal": boolean;
            "isRepositoryEntity": boolean;
            "name": string;
            "properties": ({
                "columnRef": {
                    "index": number;
                };
                "index": number;
                "isId": boolean;
                "name": string;
                "sinceVersion": number;
                "relationRef"?: undefined;
            } | {
                "index": number;
                "isId": boolean;
                "name": string;
                "relationRef": {
                    "index": number;
                };
                "sinceVersion": number;
                "columnRef"?: undefined;
            })[];
            "relations": {
                "index": number;
                "isId": boolean;
                "relationType": number;
                "propertyRef": {
                    "index": number;
                };
                "relationTableIndex": number;
                "sinceVersion": number;
            }[];
            "sinceVersion": number;
            "tableConfig": {
                "name": string;
                "indexes": any[];
            };
        }[];
        "integerVersion": number;
        "referencedSchemas": any[];
        "versionString": string;
    }[];
};
