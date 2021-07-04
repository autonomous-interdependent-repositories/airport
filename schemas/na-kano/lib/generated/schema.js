/* eslint-disable */
export const SCHEMA = {
    "domain": "air",
    "index": null,
    "name": "@airport/na-kano",
    "packageName": "@airport/na-kano",
    "sinceVersion": 1,
    "versions": [
        {
            "entities": [
                {
                    "columns": [
                        {
                            "index": 0,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 0,
                                    "oneSchemaIndex": 0,
                                    "oneTableIndex": 4,
                                    "oneColumnIndex": 0,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "REPOSITORY_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 1
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 1,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 1,
                                    "oneSchemaIndex": 0,
                                    "oneTableIndex": 6,
                                    "oneColumnIndex": 0,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "ACTOR_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 2
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 2,
                            "isGenerated": true,
                            "manyRelationColumnRefs": [],
                            "name": "ACTOR_RECORD_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 3
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 3,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "IS_DRAFT",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 0
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 1
                        },
                        {
                            "index": 4,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "AGE_SUITABILITY",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 4
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 5,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "SYSTEM_WIDE_OPERATION_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 5
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 6,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "NAME",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 6
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 5
                        }
                    ],
                    "idColumnRefs": [
                        {
                            "index": 0
                        },
                        {
                            "index": 1
                        },
                        {
                            "index": 2
                        }
                    ],
                    "index": 0,
                    "isLocal": false,
                    "isRepositoryEntity": true,
                    "name": "TodoList",
                    "properties": [
                        {
                            "columnRef": {
                                "index": 3
                            },
                            "index": 0,
                            "isId": false,
                            "name": "draft",
                            "sinceVersion": 1
                        },
                        {
                            "index": 1,
                            "isId": true,
                            "name": "repository",
                            "relationRef": {
                                "index": 0
                            },
                            "sinceVersion": 1
                        },
                        {
                            "index": 2,
                            "isId": true,
                            "name": "actor",
                            "relationRef": {
                                "index": 1
                            },
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 2
                            },
                            "index": 3,
                            "isId": true,
                            "name": "actorRecordId",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 4
                            },
                            "index": 4,
                            "isId": false,
                            "name": "ageSuitability",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 5
                            },
                            "index": 5,
                            "isId": false,
                            "name": "systemWideOperationId",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 6
                            },
                            "index": 6,
                            "isId": false,
                            "name": "name",
                            "sinceVersion": 1
                        },
                        {
                            "index": 7,
                            "isId": false,
                            "name": "items",
                            "relationRef": {
                                "index": 2
                            },
                            "sinceVersion": 1
                        }
                    ],
                    "relations": [
                        {
                            "index": 0,
                            "isId": true,
                            "relationType": 1,
                            "propertyRef": {
                                "index": 1
                            },
                            "relationTableIndex": 4,
                            "relationTableSchemaIndex": 0,
                            "sinceVersion": 1
                        },
                        {
                            "index": 1,
                            "isId": true,
                            "relationType": 1,
                            "propertyRef": {
                                "index": 2
                            },
                            "relationTableIndex": 6,
                            "relationTableSchemaIndex": 0,
                            "sinceVersion": 1
                        },
                        {
                            "index": 2,
                            "isId": false,
                            "oneToManyElems": {
                                "mappedBy": "todoList"
                            },
                            "relationType": 0,
                            "propertyRef": {
                                "index": 7
                            },
                            "relationTableIndex": 1,
                            "sinceVersion": 1
                        }
                    ],
                    "sinceVersion": 1,
                    "tableConfig": {
                        "name": "TODO_LIST",
                        "indexes": []
                    }
                },
                {
                    "columns": [
                        {
                            "index": 0,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 0,
                                    "oneSchemaIndex": 0,
                                    "oneTableIndex": 4,
                                    "oneColumnIndex": 0,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "REPOSITORY_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 1
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 1,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 1,
                                    "oneSchemaIndex": 0,
                                    "oneTableIndex": 6,
                                    "oneColumnIndex": 0,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "ACTOR_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 2
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 2,
                            "isGenerated": true,
                            "manyRelationColumnRefs": [],
                            "name": "ACTOR_RECORD_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 3
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 3,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "IS_DRAFT",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 0
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 1
                        },
                        {
                            "index": 4,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "AGE_SUITABILITY",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 4
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 5,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "SYSTEM_WIDE_OPERATION_ID",
                            "notNull": true,
                            "propertyRefs": [
                                {
                                    "index": 5
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 6,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "ASSIGNED_TO",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 6
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 5
                        },
                        {
                            "index": 7,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "COMPLETED",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 7
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 1
                        },
                        {
                            "index": 8,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [],
                            "name": "NAME",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 8
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 5
                        },
                        {
                            "index": 9,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 2,
                                    "oneSchemaIndex": null,
                                    "oneTableIndex": 0,
                                    "oneRelationIndex": 2,
                                    "oneColumnIndex": 0,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "TODO_LIST_RID",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 9
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 10,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 2,
                                    "oneSchemaIndex": null,
                                    "oneTableIndex": 0,
                                    "oneRelationIndex": 2,
                                    "oneColumnIndex": 1,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "TODO_LIST_AID",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 9
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        },
                        {
                            "index": 11,
                            "isGenerated": false,
                            "manyRelationColumnRefs": [
                                {
                                    "manyRelationIndex": 2,
                                    "oneSchemaIndex": null,
                                    "oneTableIndex": 0,
                                    "oneRelationIndex": 2,
                                    "oneColumnIndex": 2,
                                    "sinceVersion": 1
                                }
                            ],
                            "name": "TODO_LIST_ARID",
                            "notNull": false,
                            "propertyRefs": [
                                {
                                    "index": 9
                                }
                            ],
                            "sinceVersion": 1,
                            "type": 4
                        }
                    ],
                    "idColumnRefs": [
                        {
                            "index": 0
                        },
                        {
                            "index": 1
                        },
                        {
                            "index": 2
                        }
                    ],
                    "index": 1,
                    "isLocal": false,
                    "isRepositoryEntity": true,
                    "name": "TodoItem",
                    "properties": [
                        {
                            "columnRef": {
                                "index": 3
                            },
                            "index": 0,
                            "isId": false,
                            "name": "draft",
                            "sinceVersion": 1
                        },
                        {
                            "index": 1,
                            "isId": true,
                            "name": "repository",
                            "relationRef": {
                                "index": 0
                            },
                            "sinceVersion": 1
                        },
                        {
                            "index": 2,
                            "isId": true,
                            "name": "actor",
                            "relationRef": {
                                "index": 1
                            },
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 2
                            },
                            "index": 3,
                            "isId": true,
                            "name": "actorRecordId",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 4
                            },
                            "index": 4,
                            "isId": false,
                            "name": "ageSuitability",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 5
                            },
                            "index": 5,
                            "isId": false,
                            "name": "systemWideOperationId",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 6
                            },
                            "index": 6,
                            "isId": false,
                            "name": "assignedTo",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 7
                            },
                            "index": 7,
                            "isId": false,
                            "name": "completed",
                            "sinceVersion": 1
                        },
                        {
                            "columnRef": {
                                "index": 8
                            },
                            "index": 8,
                            "isId": false,
                            "name": "name",
                            "sinceVersion": 1
                        },
                        {
                            "index": 9,
                            "isId": false,
                            "name": "todoList",
                            "relationRef": {
                                "index": 2
                            },
                            "sinceVersion": 1
                        }
                    ],
                    "relations": [
                        {
                            "index": 0,
                            "isId": true,
                            "relationType": 1,
                            "propertyRef": {
                                "index": 1
                            },
                            "relationTableIndex": 4,
                            "relationTableSchemaIndex": 0,
                            "sinceVersion": 1
                        },
                        {
                            "index": 1,
                            "isId": true,
                            "relationType": 1,
                            "propertyRef": {
                                "index": 2
                            },
                            "relationTableIndex": 6,
                            "relationTableSchemaIndex": 0,
                            "sinceVersion": 1
                        },
                        {
                            "index": 2,
                            "isId": false,
                            "relationType": 1,
                            "propertyRef": {
                                "index": 9
                            },
                            "relationTableIndex": 0,
                            "sinceVersion": 1
                        }
                    ],
                    "sinceVersion": 1,
                    "tableConfig": {
                        "name": "TODO_ITEM",
                        "indexes": []
                    }
                }
            ],
            "integerVersion": 1,
            "referencedSchemas": [
                {
                    "domain": "air",
                    "index": 0,
                    "name": "@airport/holding-pattern",
                    "packageName": "@airport/holding-pattern",
                    "sinceVersion": 1,
                    "versions": [
                        {
                            "entities": null,
                            "integerVersion": 1,
                            "referencedSchemas": null,
                            "versionString": "1.0.0"
                        }
                    ]
                }
            ],
            "versionString": "1.0.0"
        }
    ]
};
//# sourceMappingURL=schema.js.map