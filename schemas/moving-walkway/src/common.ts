import {
	IActor,
	IRepository,
	IRepositoryTransactionHistory
}                from "@airport/holding-pattern";
import {
	IDomain,
	IApplication,
	IApplicationVersion
}                from "@airport/airspace";
import {
	ITerminal,
	IUser
}                from '@airport/travel-document-checkpoint-internal'

export interface RepositoryTransactionBlockData {
	actors: IActor[];
	// Domains can be referenced in multiple applications of RTB
	domains: IDomain[];
	referencedRepositories: IRepository[];
	repository: IRepository;
	repoTransHistories: IRepositoryTransactionHistory[];
	/*
	 A given Repository Transaction Block can have multiple versions of any involved application.
	 This is because it may contain RTHs across any number of application upgrades (over any
	 period of time).

	 Hence applications can be referenced in multiple application versions
	  */
	applications: IApplication[];
	applicationVersions: IApplicationVersion[];
	terminal: ITerminal;
	users: IUser[];
}