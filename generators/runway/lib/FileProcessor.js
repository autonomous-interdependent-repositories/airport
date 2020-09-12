"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const OperationGenerator_1 = require("./dao/parser/OperationGenerator");
const EntityCandidateRegistry_1 = require("./ddl/parser/EntityCandidateRegistry");
const EntityDefinitionGenerator_1 = require("./ddl/parser/EntityDefinitionGenerator");
const utils_1 = require("./ddl/parser/utils");
const enumMap = new Map();
globalThis.enumMap = enumMap;
/** Generate documention for all classes in a set of .ts files */
function generateDefinitions(fileNames, options, configuration, schemaMapByProjectName) {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);
    globalThis.checker = program.getTypeChecker();
    // Get the checker, we will use it to find more about classes
    EntityDefinitionGenerator_1.globalCandidateRegistry.configuration = configuration;
    EntityDefinitionGenerator_1.globalCandidateRegistry.schemaMap = schemaMapByProjectName;
    globalThis.processedCandidateRegistry = new EntityCandidateRegistry_1.EntityCandidateRegistry(enumMap);
    // const daoFileMap: { [classPath: string]: DaoFile } = {}
    const sourceFiles = program.getSourceFiles();
    // Visit every sourceFile in the program
    for (const sourceFile of sourceFiles) {
        globalThis.currentSourceFile = sourceFile;
        // Walk the tree to searchOne for classes
        ts.forEachChild(sourceFile, visit);
    }
    // print out the doc
    // fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
    return EntityDefinitionGenerator_1.globalCandidateRegistry
        .matchVerifiedEntities(globalThis.processedCandidateRegistry);
}
exports.generateDefinitions = generateDefinitions;
/** visit nodes finding exported classes */
function visit(node) {
    let path = utils_1.getClassPath(node.parent);
    // Only top level entities are supported
    if (!path) {
        return;
    }
    // Do not process libraries
    if (path.indexOf('node_modules') > -1) {
        return;
    }
    // Do not process files outside of the project (possible with MS Rush setup)
    if (path.indexOf(process.cwd() + '/src') > -1
        || path.indexOf(process.cwd() + '\src') > -1) {
        return;
    }
    // if (path.indexOf(globalThis.configuration.airport.node_modulesLinks.pathToProject) == -1) {
    // 	return
    // }
    if (globalThis.configuration.airport.daoDir
        && path.indexOf(globalThis.configuration.airport.daoDir) > 0) {
        OperationGenerator_1.visitDaoFile(node, path);
    }
    else if (path.indexOf(globalThis.configuration.airport.ddlDir) > 0) {
        EntityDefinitionGenerator_1.visitEntityFile(node, path);
    }
}
//# sourceMappingURL=FileProcessor.js.map