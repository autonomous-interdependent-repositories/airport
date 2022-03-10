import {
	AIRPORT_DATABASE
} from '@airport/air-control';
import {
	container,
	DI,
	IContext
} from '@airport/di';
import {
	FullApplicationName,
	getFullApplicationName,
	STORE_DRIVER,
} from '@airport/ground-control';
import {
	Actor,
} from '@airport/holding-pattern';
import { IApplication, APPLICATION_DAO } from '@airport/airspace';
import {
	APPLICATION_INITIALIZER,
	IDatabaseManager,
	TRANSACTIONAL_SERVER
} from '@airport/terminal-map';
import {
	DATABASE_MANAGER,
	INTERNAL_RECORD_MANAGER
} from '../tokens';
import { JsonApplicationWithLastIds } from '@airport/security-check';
import { BLUEPRINT } from '@airport/blueprint';

export class DatabaseManager
	implements IDatabaseManager {

	private initialized = false;

	async initNoDb(
		context: IContext,
		...applications: JsonApplicationWithLastIds[]
	): Promise<void> {
		await container(this).get(AIRPORT_DATABASE);

		const server = await container(this).get(TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();

		await this.installStarterApplication(true, false, context);

		const applicationInitializer = await container(this).get(APPLICATION_INITIALIZER);
		await applicationInitializer.stage(applications, context);
		(server as any).tempActor = null;
		this.initialized = true;
	}

	async initWithDb(
		domainName: string,
		context: IContext
	): Promise<void> {
		await container(this).get(AIRPORT_DATABASE);

		const storeDriver = await container(this).get(STORE_DRIVER);

		const server = await container(this).get(TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();

		const hydrate = await storeDriver.doesTableExist(getFullApplicationName(BLUEPRINT[0]),
			'PACKAGES', context);

		await this.installStarterApplication(false, hydrate, context);

		if (!hydrate) {
			const internalRecordManager = await container(this)
				.get(INTERNAL_RECORD_MANAGER)
			await internalRecordManager.initTerminal(domainName, context)
		}

		(server as any).tempActor = null;
		this.initialized = true;
	}

	isInitialized(): boolean {
		return this.initialized;
	}

	async initFeatureApplications(
		context: IContext,
		jsonApplications?: JsonApplicationWithLastIds[]
	): Promise<void> {
		const applicationDao = await container(this).get(APPLICATION_DAO);

		const applications = await applicationDao.findAllWithJson()
		const existingApplicationMap: Map<FullApplicationName, IApplication> = new Map()
		for (const application of applications) {
			existingApplicationMap.set(application.fullName, application)
		}

		const applicationsToCreate: JsonApplicationWithLastIds[] = []
		for (const jsonApplication of jsonApplications) {
			const existingApplication = existingApplicationMap.get(getFullApplicationName(jsonApplication))
			if (existingApplication) {
				jsonApplication.lastIds = existingApplication.versions[0].jsonApplication.lastIds
			} else {
				applicationsToCreate.push(jsonApplication)
			}
		}

		// if (applicationsToCreate.length) {
		const [applicationInitializer, server] = await container(this)
			.get(APPLICATION_INITIALIZER, TRANSACTIONAL_SERVER);
		(server as any).tempActor = new Actor();
		// await applicationInitializer.initialize(applicationsToCreate, context, existingApplicationsAreHydrated);
		await applicationInitializer.initialize(applicationsToCreate, existingApplicationMap, context, true);
		// }

		(server as any).tempActor = null;
	}

	/*
	static async addDataStore(
		storeType: StoreType,
		terminalName: string
	): Promise<void> {
		if (this.isInitialized(terminalName)) {
			throw new Error(
			`Database '${terminalName}' is already initialized`);
		}
		const newDataStore = await QDataStore.db(dbConst.DEFAULT_DB).save({
			name: terminalName,
			storeType: storeType
		});
		await TQ.init(storeType, terminalName);
	}

	private doEnsureInitialized(
		terminalName: string,
		resolve,
		reject,
		remainingTimeout: number
	): void {
		if (this.isInitialized(terminalName)) {
			resolve()
		}
		if (remainingTimeout <= 0) {
			reject(`Timeout out waiting for initialization of DB: [${terminalName}]`)
		}
		remainingTimeout -= 100
		setTimeout(() => {
			this.doEnsureInitialized(terminalName, resolve, reject, remainingTimeout)
		}, 100)
	}
	*/

	private async installStarterApplication(
		stage: boolean,
		hydrate: boolean,
		context: IContext,
	) {
		const blueprintFile = await import('@airport/blueprint');
		const applicationInitializer = await container(this).get(APPLICATION_INITIALIZER);
		if (stage) {
			await applicationInitializer.stage(blueprintFile.BLUEPRINT as any, context);
		} else if (hydrate) {
			await applicationInitializer.hydrate(blueprintFile.BLUEPRINT as any, context);
			// Below appears to be not needed - hydrate gets all applications
			// const applicationDao = await container(this).get(APPLICATION_DAO)
			// const applications = await applicationDao.findAll()
			// const jsonApplicationNameSet: Set<string> = new Set()
			// blueprintFile.BLUEPRINT
			// 	.map(jsonApplication => getFullApplicationName(jsonApplication))
			// 	// schemname contains both domain and application's actual name
			// 	.forEach(applicationName => {
			// 		jsonApplicationNameSet.add(applicationName)
			// 	})
			// const jsonApplications = applications.filter(application => !jsonApplicationNameSet.has(application.fullName))
			// 	.map(application => application.jsonApplication)
			// await applicationInitializer.hydrate(jsonApplications as any, context);
		} else {
			await applicationInitializer.initialize(blueprintFile.BLUEPRINT as any, new Map(),
				context, false);
		}
	}
}

DI.set(DATABASE_MANAGER, DatabaseManager);
