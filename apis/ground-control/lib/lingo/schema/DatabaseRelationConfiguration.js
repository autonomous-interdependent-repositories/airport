// export interface AddToDatabaseJoinFunction<QOtm extends IQEntity, QMto extends IQEntity> {
// 	(
// 		otm: QOtm, // One-to-Many IQEntity
// 		mto: QMto, // Many-to-One IQEntity
// 		db: IAirportDatabase, // Reference to the Airport functionality
// 		f: FunctionsAndOperators // Reference to all available functions and operators
// 	): JSONBaseOperation;
// }
export var CascadeType;
(function (CascadeType) {
    CascadeType[CascadeType["NONE"] = 0] = "NONE";
    CascadeType[CascadeType["ALL"] = 1] = "ALL";
    // Cascade detach is not implemented because there is no session
    // DETACH,
    // Cascade merge is not implemented because there is no session
    // MERGE,
    CascadeType[CascadeType["CREATE"] = 2] = "CREATE";
    CascadeType[CascadeType["PERSIST"] = 3] = "PERSIST";
    // Cascade refresh is not implemented because there is no session
    // REFRESH,
    CascadeType[CascadeType["REMOVE"] = 4] = "REMOVE";
    CascadeType[CascadeType["UPDATE"] = 5] = "UPDATE"; // New to Airport
})(CascadeType || (CascadeType = {}));
export var CascadeOverwrite;
(function (CascadeOverwrite) {
    // Always cascade
    CascadeOverwrite[CascadeOverwrite["ALWAYS"] = 0] = "ALWAYS";
    // Follow the default entity configuration rules
    CascadeOverwrite[CascadeOverwrite["DEFAULT"] = 1] = "DEFAULT";
    // Never cascade
    CascadeOverwrite[CascadeOverwrite["NEVER"] = 2] = "NEVER";
})(CascadeOverwrite || (CascadeOverwrite = {}));
//# sourceMappingURL=DatabaseRelationConfiguration.js.map