import {
	IMemoizedSelector,
	SELECTOR_MANAGER
} from '@airport/check-in';
import { DI } from '@airport/di';
import {
	ApplicationSignature,
	DomainName,
	ensureChildJsMap,
	JsonApplicationName,
	ApplicationName,
	FullApplicationName
} from '@airport/ground-control';
import { IActor } from '@airport/holding-pattern';
import {
	IDomain,
	IApplication,
	IApplicationColumn,
	IApplicationEntity,
	IApplicationRelation,
	IApplicationVersion
} from '@airport/airspace';
import { Subject } from 'rxjs';
import { TERMINAL_STORE } from '../tokens';
import { ITerminalState } from './TerminalState';
import { TERMINAL_STATE } from './theState';

export interface ITerminalStore {

	state: Subject<ITerminalState>

	getApplicationActors: IMemoizedSelector<IActor[], ITerminalState>

	getApplicationActorMapByDomainAndApplicationNames: IMemoizedSelector<Map<DomainName, Map<ApplicationName, IActor[]>>, ITerminalState>

	getDomains: IMemoizedSelector<IDomain[], ITerminalState>

	getDomainMapByName: IMemoizedSelector<Map<DomainName, IDomain>, ITerminalState>

	getFrameworkActor: IMemoizedSelector<IActor, ITerminalState>

	getLatestApplicationVersionMapByNames: IMemoizedSelector<Map<DomainName, Map<JsonApplicationName, IApplicationVersion>>, ITerminalState>

	// Application name contains the domain name as a prefix + '___'
	getLatestApplicationVersionMapByFullApplicationName: IMemoizedSelector<Map<FullApplicationName, IApplicationVersion>, ITerminalState>

	getAllApplicationVersionsByIds: IMemoizedSelector<IApplicationVersion[], ITerminalState>

	getLatestApplicationVersionsByApplicationIndexes: IMemoizedSelector<IApplicationVersion[], ITerminalState>

	getTerminalState: IMemoizedSelector<ITerminalState, ITerminalState>

	getApplications: IMemoizedSelector<IApplication[], ITerminalState>

	getAllColumns: IMemoizedSelector<IApplicationColumn[], ITerminalState>

	getAllEntities: IMemoizedSelector<IApplicationEntity[], ITerminalState>

	getAllRelations: IMemoizedSelector<IApplicationRelation[], ITerminalState>

	getInitializingApps: IMemoizedSelector<Set<FullApplicationName>, ITerminalState>

	getInitializedApps: IMemoizedSelector<Set<FullApplicationName>, ITerminalState>

	tearDown()
}

export class TerminalStore
	implements ITerminalStore {

	state: Subject<ITerminalState>;

	getApplicationActors: IMemoizedSelector<IActor[], ITerminalState>

	getApplicationActorMapByDomainAndApplicationNames: IMemoizedSelector<Map<DomainName, Map<ApplicationName, IActor[]>>, ITerminalState>

	getDomains: IMemoizedSelector<IDomain[], ITerminalState>;

	getDomainMapByName: IMemoizedSelector<Map<DomainName, IDomain>, ITerminalState>

	getFrameworkActor: IMemoizedSelector<IActor, ITerminalState>

	getLatestApplicationVersionMapByNames: IMemoizedSelector<Map<DomainName, Map<JsonApplicationName, IApplicationVersion>>, ITerminalState>;

	getLatestApplicationVersionMapByFullApplicationName: IMemoizedSelector<Map<FullApplicationName, IApplicationVersion>, ITerminalState>;

	getAllApplicationVersionsByIds: IMemoizedSelector<IApplicationVersion[], ITerminalState>;

	getLatestApplicationVersionsByApplicationIndexes: IMemoizedSelector<IApplicationVersion[], ITerminalState>;

	getTerminalState: IMemoizedSelector<ITerminalState, ITerminalState>;

	getApplications: IMemoizedSelector<IApplication[], ITerminalState>;

	getAllColumns: IMemoizedSelector<IApplicationColumn[], ITerminalState>;

	getAllEntities: IMemoizedSelector<IApplicationEntity[], ITerminalState>;

	getAllRelations: IMemoizedSelector<IApplicationRelation[], ITerminalState>;

	getInitializingApps: IMemoizedSelector<Set<FullApplicationName>, ITerminalState>

	getInitializedApps: IMemoizedSelector<Set<FullApplicationName>, ITerminalState>

	async init(): Promise<void> {
		const selectorManager = await DI.db().get(SELECTOR_MANAGER);
		this.state = TERMINAL_STATE;

		this.getTerminalState = selectorManager.createRootSelector(this.state);
		this.getApplicationActors = selectorManager.createSelector(this.getTerminalState,
			terminal => terminal.applicationActors)
		this.getApplicationActorMapByDomainAndApplicationNames = selectorManager.createSelector(this.getApplicationActors,
			applicationActors => {
				const applicationActorsByDomainAndApplicationNames: Map<DomainName, Map<ApplicationName, IActor[]>> = new Map()
				for (const applicationActor of applicationActors) {
					const applicationActorMapForDomain = ensureChildJsMap(applicationActorsByDomainAndApplicationNames,
						applicationActor.application.domain.name)
					let actorsForApplication = applicationActorMapForDomain
						.get(applicationActor.application.name)
					if (!actorsForApplication) {
						actorsForApplication = []
						applicationActorMapForDomain.set(
							applicationActor.application.name, actorsForApplication)
					}
					actorsForApplication.push(applicationActor)
				}
				return applicationActorsByDomainAndApplicationNames
			})
		this.getDomains = selectorManager.createSelector(this.getTerminalState,
			terminal => terminal.domains);
		this.getDomainMapByName = selectorManager.createSelector(this.getDomains,
			domains => {
				const domainsByName: Map<ApplicationSignature, IDomain> = new Map()
				for (const domain of domains) {
					domainsByName.set(domain.name, domain)
				}
				return domainsByName
			})
		this.getFrameworkActor = selectorManager.createSelector(this.getTerminalState,
			terminal => terminal.frameworkActor)
		this.getInitializedApps = selectorManager.createSelector(this.getTerminalState,
			terminalState => terminalState.initializedApps)
		this.getInitializingApps = selectorManager.createSelector(this.getTerminalState,
			terminalState => terminalState.initializingApps)
		this.getLatestApplicationVersionMapByNames = selectorManager.createSelector(this.getDomains,
			domains => {
				const latestApplicationVersionMapByNames: Map<DomainName, Map<ApplicationName, IApplicationVersion>> = new Map();

				for (const domain of domains) {
					const mapForDomain = ensureChildJsMap(latestApplicationVersionMapByNames, domain.name);
					for (const application of domain.applications) {
						mapForDomain.set(application.name, application.currentVersion[0].applicationVersion);
					}
				}

				return latestApplicationVersionMapByNames;
			});

		this.getLatestApplicationVersionMapByFullApplicationName = selectorManager.createSelector(
			this.getLatestApplicationVersionMapByNames, (
				latestApplicationVersionMapByNames: Map<DomainName, Map<JsonApplicationName, IApplicationVersion>>
			) => {
			const latestApplicationVersionMapByFullApplicationName: Map<FullApplicationName, IApplicationVersion> = new Map();

			for (const applicationVersionsForDomainName of latestApplicationVersionMapByNames.values()) {
				for (const applicationVersion of applicationVersionsForDomainName.values()) {
					latestApplicationVersionMapByFullApplicationName.set(applicationVersion.application.fullName, applicationVersion);
				}
			}

			return latestApplicationVersionMapByFullApplicationName;
		});

		this.getAllApplicationVersionsByIds = selectorManager.createSelector(this.getDomains,
			domains => {
				const allApplicationVersionsByIds: IApplicationVersion[] = [];

				for (const domain of domains) {
					for (const application of domain.applications) {
						for (const applicationVersion of application.versions) {
							allApplicationVersionsByIds[applicationVersion.id] = applicationVersion;
						}
					}
				}

				return allApplicationVersionsByIds;
			});

		this.getLatestApplicationVersionsByApplicationIndexes = selectorManager.createSelector(this.getDomains,
			domains => {
				const latestApplicationVersionsByApplicationIndexes: IApplicationVersion[] = [];

				for (const domain of domains) {
					for (const application of domain.applications) {
						latestApplicationVersionsByApplicationIndexes[application.index]
							= application.currentVersion[0].applicationVersion;
					}
				}

				return latestApplicationVersionsByApplicationIndexes;
			});

		this.getApplications = selectorManager.createSelector(this.getTerminalState,
			terminal => terminal.applications);

		this.getAllEntities = selectorManager.createSelector(this.getLatestApplicationVersionsByApplicationIndexes,
			latestApplicationVersionsByApplicationIndexes => {
				const allEntities: IApplicationEntity[] = [];
				for (const latestApplicationVersion of latestApplicationVersionsByApplicationIndexes) {
					if (!latestApplicationVersion) {
						continue;
					}
					for (const entity of latestApplicationVersion.entities) {
						allEntities[entity.id] = entity;
					}
				}

				return allEntities;
			});

		this.getAllColumns = selectorManager.createSelector(this.getAllEntities,
			allEntities => {
				const allColumns: IApplicationColumn[] = [];

				for (const entity of allEntities) {
					if (!entity) {
						continue;
					}
					for (const column of entity.columns) {
						allColumns[column.id] = column;
					}
				}

				return allColumns;
			});

		this.getAllRelations = selectorManager.createSelector(this.getAllEntities,
			allEntities => {
				const allRelations: IApplicationRelation[] = [];

				for (const entity of allEntities) {
					if (!entity) {
						continue;
					}
					for (const relation of entity.relations) {
						allRelations[relation.id] = relation;
					}
				}

				return allRelations;
			});
	}

	tearDown() {
	}
}

DI.set(TERMINAL_STORE, TerminalStore);
