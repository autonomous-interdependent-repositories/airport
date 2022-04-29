import { AIRPORT_DATABASE } from '@airport/air-control'
import { SEQUENCE_DAO } from '@airport/airport-code'
import { APPLICATION_COLUMN_DAO, APPLICATION_DAO, APPLICATION_ENTITY_DAO, APPLICATION_PROPERTY_COLUMN_DAO, APPLICATION_PROPERTY_DAO, APPLICATION_REFERENCE_DAO, APPLICATION_RELATION_COLUMN_DAO, APPLICATION_RELATION_DAO, APPLICATION_VERSION_DAO, DOMAIN_DAO } from '@airport/airspace'
import { SEQUENCE_GENERATOR } from '@airport/check-in'
import { lib } from '@airport/direction-indicator'
import { QUERY_OBJECT_INITIALIZER } from '@airport/takeoff'
import { DOMAIN_RETRIEVER, STORE_DRIVER, TERMINAL_STORE } from '@airport/terminal-map'
import { ApplicationInitializer } from './ApplicationInitializer'
import { IApplicationBuilder } from './builder/IApplicationBuilder'
import { SqlApplicationBuilder } from './builder/SqlApplicationBuilder'
import { ApplicationChecker, IApplicationChecker } from './checker/ApplicationChecker'
import { ApplicationLocator, IApplicationLocator } from './locator/ApplicationLocator'
import { ApplicationComposer, IApplicationComposer } from './recorder/ApplicationComposer'
import { ApplicationRecorder, IApplicationRecorder } from './recorder/ApplicationRecorder'

const landing = lib('landing')

export const ABSTRACT_APPLICATION_INITIALIZER = landing.token<ApplicationInitializer>({
    class: ApplicationInitializer,
    interface: 'class ApplicationInitializer',
    token: 'ABSTRACT_APPLICATION_INITIALIZER'
})
export const APPLICATION_BUILDER = landing.token<IApplicationBuilder>({
    class: null,
    interface: 'IApplicationBuilder',
    token: 'APPLICATION_BUILDER'
})
export const APPLICATION_CHECKER = landing.token<IApplicationChecker>({
    class: ApplicationChecker,
    interface: 'IApplicationChecker',
    token: 'APPLICATION_CHECKER'
})
export const APPLICATION_COMPOSER = landing.token<IApplicationComposer>({
    class: ApplicationComposer,
    interface: 'IApplicationComposer',
    token: 'APPLICATION_COMPOSER'
})
export const APPLICATION_LOCATOR = landing.token<IApplicationLocator>({
    class: ApplicationLocator,
    interface: 'IApplicationLocator',
    token: 'APPLICATION_LOCATOR'
})
export const APPLICATION_RECORDER = landing.token<IApplicationRecorder>({
    class: ApplicationRecorder,
    interface: 'IApplicationRecorder',
    token: 'APPLICATION_RECORDER'
})

export const SQL_APPLICATION_BUILDER = landing.token<IApplicationBuilder>({
    class: SqlApplicationBuilder,
    interface: 'class SqlApplicationBuilder',
    token: 'SQL_APPLICATION_BUILDER'
})

ABSTRACT_APPLICATION_INITIALIZER.setDependencies({
    airportDatabase: AIRPORT_DATABASE,
    applicationBuilder: APPLICATION_BUILDER,
    applicationChecker: APPLICATION_CHECKER,
    applicationDao: APPLICATION_DAO,
    applicationLocator: APPLICATION_LOCATOR,
    queryObjectInitializer: QUERY_OBJECT_INITIALIZER,
    sequenceGenerator: SEQUENCE_GENERATOR,
    terminalStore: TERMINAL_STORE
})

APPLICATION_CHECKER.setDependencies({
    applicationDao: APPLICATION_DAO
})

APPLICATION_COMPOSER.setDependencies({
    applicationLocator: APPLICATION_LOCATOR,
    domainRetriever: DOMAIN_RETRIEVER,
    terminalStore: TERMINAL_STORE
})

APPLICATION_RECORDER.setDependencies({
    applicationColumnDao: APPLICATION_COLUMN_DAO,
    applicationDao: APPLICATION_DAO,
    applicationEntityDao: APPLICATION_ENTITY_DAO,
    applicationPropertyColumnDao: APPLICATION_PROPERTY_COLUMN_DAO,
    applicationPropertyDao: APPLICATION_PROPERTY_DAO,
    applicationRecorder: APPLICATION_RECORDER,
    applicationReferenceDao: APPLICATION_REFERENCE_DAO,
    applicationRelationColumnDao: APPLICATION_RELATION_COLUMN_DAO,
    applicationRelationDao: APPLICATION_RELATION_DAO,
    applicationVersionDao: APPLICATION_VERSION_DAO,
    domainDao: DOMAIN_DAO
})

SQL_APPLICATION_BUILDER.setDependencies({
    airportDatabase: AIRPORT_DATABASE,
    sequenceDao: SEQUENCE_DAO,
    storeDriver: STORE_DRIVER
})
