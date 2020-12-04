import { system } from '@airport/di';
const tower = system('airport')
    .lib('tower');
export const CASCADE_GRAPH_VERIFIER = tower.token('ICascadeGraphVerifier');
export const DEPENDENCY_GRAPH_RESOLVER = tower.token('IDependencyGraphResolver');
export const ENTITY_GRAPH_RECONSTRUCTOR = tower.token('IEntityGraphReconstructor');
export const OPERATION_CONTEXT_LOADER = tower.token('IOperationContextLoader');
export const STRUCTURAL_ENTITY_VALIDATOR = tower.token('IStructuralEntityValidator');
export const TRANS_SERVER = tower.token('ITransactionalServer');
//# sourceMappingURL=tokens.js.map