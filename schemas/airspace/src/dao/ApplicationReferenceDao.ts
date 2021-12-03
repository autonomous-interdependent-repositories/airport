import {DI}                   from '@airport/di'
import {ApplicationVersionId}      from '@airport/ground-control'
import {APPLICATION_REFERENCE_DAO} from '../tokens'
import {
	BaseApplicationReferenceDao,
	IBaseApplicationReferenceDao,
	IApplicationReference,
	Q,
	QApplicationReference,
}                             from '../generated/generated'

export interface IApplicationReferenceDao
	extends IBaseApplicationReferenceDao {

	findAllForApplicationVersions(
		applicationVersionIds: ApplicationVersionId[]
	): Promise<IApplicationReference[]>

	insert(
		applicationReferences: IApplicationReference[]
	): Promise<void>

}

export class ApplicationReferenceDao
	extends BaseApplicationReferenceDao
	implements IApplicationReferenceDao {

	async findAllForApplicationVersions(
		applicationVersionIds: ApplicationVersionId[]
	): Promise<IApplicationReference[]> {
		let sr: QApplicationReference

		return await this.db.find.tree({
			select: {},
			from: [
				sr = Q.ApplicationReference
			],
			where: sr.ownApplicationVersion.id.in(applicationVersionIds)
		})
	}

	async insert(
		applicationReferences: IApplicationReference[]
	): Promise<void> {
		let sr: QApplicationReference;
		const values = []
		for (const applicationReference of applicationReferences) {
			values.push([
				applicationReference.ownApplicationVersion.id, 
				applicationReference.referencedApplicationVersion.id,
				applicationReference.index,
				applicationReference.deprecatedSinceVersion ? applicationReference.deprecatedSinceVersion.id : null,
				applicationReference.removedInVersion ? applicationReference.removedInVersion.id : null,
				applicationReference.sinceVersion ? applicationReference.sinceVersion.id : null,
			])
		}
		await this.db.insertValuesGenerateIds({
			insertInto: sr = Q.ApplicationReference,
			columns: [
				sr.ownApplicationVersion.id,
				sr.referencedApplicationVersion.id,
				sr.index,
				sr.deprecatedSinceVersion.id,
				sr.removedInVersion.id,
				sr.sinceVersion.id
			],
			values
		})
	}

}

DI.set(APPLICATION_REFERENCE_DAO, ApplicationReferenceDao)