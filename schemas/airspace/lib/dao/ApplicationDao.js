import { AIRPORT_DATABASE, and, max, tree, Y } from '@airport/air-control';
import { container, DI } from '@airport/di';
import { ensureChildJsMap } from '@airport/ground-control';
import { APPLICATION_DAO } from '../tokens';
import { BaseApplicationDao, Q } from '../generated/generated';
export class ApplicationDao extends BaseApplicationDao {
    async findAllActive() {
        let s;
        return this.db.find.tree({
            select: {},
            from: [
                s = Q.Application
            ]
        });
    }
    async findMapByVersionIds(applicationVersionIds) {
        const applicationMapByIndex = new Map();
        let s, sv;
        const applications = await this.db.find.tree({
            select: {
                index: Y,
                domain: {
                    id: Y,
                    name: Y
                },
                name: Y,
                versions: {
                    id: Y,
                    majorVersion: Y,
                    minorVersion: Y,
                    patchVersion: Y
                }
            },
            from: [
                s = Q.Application,
                sv = s.versions.innerJoin()
            ],
            where: sv.id.in(applicationVersionIds)
        });
        for (const application of applications) {
            for (const applicationVersion of application.versions) {
                applicationMapByIndex.set(applicationVersion.id, application);
            }
        }
        return applicationMapByIndex;
    }
    async findMaxIndex() {
        const airDb = await container(this).get(AIRPORT_DATABASE);
        const s = Q.Application;
        return await airDb.findOne.field({
            select: max(s.index),
            from: [
                s
            ]
        });
    }
    async findMaxVersionedMapByApplicationAndDomainNames(applicationDomainNames, applicationNames) {
        const airDb = await container(this).get(AIRPORT_DATABASE);
        const maxVersionedMapByApplicationAndDomainNames = new Map();
        let sv;
        let s;
        let d;
        let sMaV;
        let sMiV;
        const applicationLookupRecords = await airDb.find.tree({
            from: [
                sMiV = tree({
                    from: [
                        sMaV = tree({
                            from: [
                                s = Q.Application,
                                sv = s.versions.innerJoin(),
                                d = s.domain.innerJoin()
                            ],
                            select: {
                                index: s.index,
                                domainId: d.id,
                                domainName: d.name,
                                name: s.name,
                                jsonApplication: s.jsonApplication,
                                majorVersion: max(sv.majorVersion),
                                minorVersion: sv.minorVersion,
                                patchVersion: sv.patchVersion,
                            },
                            where: and(d.name.in(applicationDomainNames), s.name.in(applicationNames)),
                            groupBy: [
                                s.index,
                                d.id,
                                d.name,
                                s.name,
                                sv.minorVersion,
                                sv.patchVersion,
                            ]
                        })
                    ],
                    select: {
                        index: sMaV.index,
                        domainId: sMaV.domainId,
                        domainName: sMaV.domainName,
                        jsonApplication: sMaV.jsonApplication,
                        name: sMaV.name,
                        majorVersion: sMaV.majorVersion,
                        minorVersion: max(sMaV.minorVersion),
                        patchVersion: sMaV.patchVersion,
                    },
                    groupBy: [
                        sMaV.index,
                        sMaV.domainId,
                        sMaV.domainName,
                        sMaV.name,
                        sMaV.majorVersion,
                        sMaV.patchVersion
                    ]
                })
            ],
            select: {
                index: sMiV.index,
                domain: {
                    id: sMiV.domainId,
                    name: sMiV.domainName
                },
                jsonApplication: sMiV.jsonApplication,
                name: sMiV.name,
                majorVersion: sMiV.majorVersion,
                minorVersion: sMiV.minorVersion,
                patchVersion: max(sMiV.patchVersion),
            },
            groupBy: [
                sMiV.index,
                sMiV.domainId,
                sMiV.domainName,
                sMiV.name,
                sMiV.majorVersion,
                sMiV.minorVersion
            ]
        });
        for (const applicationLookupRecord of applicationLookupRecords) {
            ensureChildJsMap(maxVersionedMapByApplicationAndDomainNames, applicationLookupRecord.domain.name)
                .set(applicationLookupRecord.name, applicationLookupRecord);
        }
        return maxVersionedMapByApplicationAndDomainNames;
    }
    async setStatusByIndexes(indexes, status) {
        let s;
        await this.db.updateWhere({
            update: s = Q.Application,
            set: {
                status
            },
            where: s.index.in(indexes)
        });
    }
    async findMapByNames(applicationNames) {
        const mapByName = new Map();
        let s;
        const records = await this.db.find.tree({
            select: {},
            from: [
                s = Q.Application
            ],
            where: s.name.in(applicationNames)
        });
        for (const record of records) {
            mapByName.set(record.name, record);
        }
        return mapByName;
    }
    async findByDomainNamesAndApplicationNames(domainNames, applicationNames) {
        let s;
        let d;
        return await this.db.find.tree({
            select: {
                index: Y,
                domain: {
                    id: Y,
                    name: Y
                },
                name: Y
            },
            from: [
                s = Q.Application,
                d = s.domain.innerJoin()
            ],
            where: and(d.name.in(domainNames), s.name.in(applicationNames)),
            orderBy: [
                d.name.asc(),
                s.index.asc()
            ]
        });
    }
    async insert(applications) {
        let s;
        const values = [];
        for (const application of applications) {
            values.push([
                application.index, application.domain.id, application.scope,
                application.name, application.packageName, application.status,
                application.jsonApplication
            ]);
        }
        await this.db.insertValuesGenerateIds({
            insertInto: s = Q.Application,
            columns: [
                s.index,
                s.domain.id,
                s.scope,
                s.name,
                s.packageName,
                s.status,
                s.jsonApplication
            ],
            values
        });
    }
}
DI.set(APPLICATION_DAO, ApplicationDao);
//# sourceMappingURL=ApplicationDao.js.map