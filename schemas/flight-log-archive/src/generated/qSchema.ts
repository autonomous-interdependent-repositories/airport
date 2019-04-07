import { QSchema as AirportQSchema } from '@airport/air-control';
import { DbSchema } from '@airport/ground-control';
import { DailySyncLog } from '../ddl/dailysynclog';
import { QDailySyncLog } from './qdailysynclog';
import { Log } from '../ddl/log/log';
import { QLog } from './log/qlog';
import { MonthlySyncLog } from '../ddl/monthlysynclog';
import { QMonthlySyncLog } from './qmonthlysynclog';

import {
	IBaseDailySyncLogDuo,
	IBaseLogDuo,
	IBaseMonthlySyncLogDuo
} from './baseDuos';

import {
	IBaseDailySyncLogDao,
	IBaseLogDao,
	IBaseMonthlySyncLogDao
} from './baseDaos';

export interface LocalQSchema extends AirportQSchema {

  db: DbSchema;

	duo: {
		DailySyncLog: IBaseDailySyncLogDuo;
		Log: IBaseLogDuo;
		MonthlySyncLog: IBaseMonthlySyncLogDuo;
	}

	dao: {
		DailySyncLog: IBaseDailySyncLogDao;
		Log: IBaseLogDao;
		MonthlySyncLog: IBaseMonthlySyncLogDao;
	}
	
	DailySyncLog: QDailySyncLog;
	Log: QLog;
	MonthlySyncLog: QMonthlySyncLog;

}

const __constructors__ = {
	DailySyncLog: DailySyncLog,
	Log: Log,
	MonthlySyncLog: MonthlySyncLog
};

export const Q_SCHEMA: LocalQSchema = <any>{
	__constructors__
};
export const Q: LocalQSchema = Q_SCHEMA;
