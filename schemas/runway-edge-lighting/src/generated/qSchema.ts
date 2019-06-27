import {
	AIR_DB,
	QSchema as AirportQSchema
}                      from '@airport/air-control'
import {diSet as dS}          from '@airport/check-in'
import {DI}            from '@airport/di'
import {
	DbSchema,
	EntityId,
	getSchemaName
}                      from '@airport/ground-control';
import { LogEntry } from '../ddl/logentry';
import { QLogEntry } from './qlogentry';
import { LogEntryType } from '../ddl/logentrytype';
import { QLogEntryType } from './qlogentrytype';
import { LogEntryValue } from '../ddl/logentryvalue';
import { QLogEntryValue } from './qlogentryvalue';
import { LoggedError } from '../ddl/loggederror';
import { QLoggedError } from './qloggederror';
import { LoggedErrorStackTrace } from '../ddl/loggederrorstacktrace';
import { QLoggedErrorStackTrace } from './qloggederrorstacktrace';

export interface LocalQSchema extends AirportQSchema {

  db: DbSchema;

	LogEntry: QLogEntry;
	LogEntryType: QLogEntryType;
	LogEntryValue: QLogEntryValue;
	LoggedError: QLoggedError;
	LoggedErrorStackTrace: QLoggedErrorStackTrace;

}

const __constructors__ = {
	LogEntry: LogEntry,
	LogEntryType: LogEntryType,
	LogEntryValue: LogEntryValue,
	LoggedError: LoggedError,
	LoggedErrorStackTrace: LoggedErrorStackTrace
};

export const Q_SCHEMA: LocalQSchema = <any>{
	__constructors__,
  domain: 'github.com',
  name: '@airport/runway-edge-lighting'
};
export const Q: LocalQSchema = Q_SCHEMA

export function diSet(
	dbEntityId: EntityId
): boolean {
	return dS(Q.__dbSchema__, dbEntityId)
}

DI.get(AIR_DB).then((
	airDb
) => {
	airDb.QM[getSchemaName(Q_SCHEMA)] = Q
})
