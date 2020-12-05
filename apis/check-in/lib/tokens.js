import { system } from '@airport/di';
const checkIn = system('airport')
    .lib('check-in');
export const QUERY_RESULTS_DESERIALIZER = checkIn.token('IQueryResultsDeserializer');
export const OPERATION_SERIALIZER = checkIn.token('IOperationSerializer');
export const SEQUENCE_GENERATOR = checkIn.token('ISequenceGenerator');
//# sourceMappingURL=tokens.js.map