export var EntityState;
(function (EntityState) {
    EntityState["CREATE"] = "CREATE";
    EntityState["DATE"] = "DATE";
    EntityState["DELETE"] = "DELETE";
    EntityState["PARENT_ID"] = "PARENT_ID";
    EntityState["PASS_THROUGH"] = "PASS_THROUGH";
    // Not sure if RESULT is still needed, with removal of RESULT_JSON and RESULT_JSON_ARRAY
    // RESULT = 'RESULT',
    EntityState["STUB"] = "STUB";
    EntityState["UPDATE"] = "UPDATE";
    // Json fields promote schema de-normalization
    // RESULT_JSON = 'RESULT_JSON',
    // RESULT_JSON_ARRAY = 'RESULT_JSON_ARRAY'
})(EntityState || (EntityState = {}));
//# sourceMappingURL=EntityStateManager.js.map