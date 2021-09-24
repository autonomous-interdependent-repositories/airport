import { AIRPORT_DATABASE } from '@airport/air-control';
import { DI } from '@airport/di';
import { JsonSchema } from '@airport/ground-control';
import { injectSequenceGenerator } from '@airport/sequence';
import { DATABASE_MANAGER } from '@airport/terminal';

export * from './SqlStorage'
export * from './WebSqlDriver'
export * from './WebSqlQueryAdaptor'
export * from './WebSqlTransaction'

injectSequenceGenerator()

export async function startDb(
	domainName: string
) {
	await DI.db().get(AIRPORT_DATABASE);
	const dbManager = await DI.db().get(DATABASE_MANAGER);
	await dbManager.initWithDb(domainName, {});
}

export async function closeDb() {

}
