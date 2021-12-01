import {
	Column,
	DbNumber,
	GeneratedValue,
	Id,
	JoinColumn,
	ManyToOne,
	MappedSuperclass
}                                      from '@airport/air-control'
import {Actor}                         from '../infrastructure/Actor'
import {SystemWideOperationId}         from '../common'
import {Stageable}                     from '../infrastructure/Stageable'
import {Repository}                    from './Repository'

/**
 * Created by Papa on 2/17/2017.
 */

export type RepositoryEntity_ActorRecordId = number
export type RepositoryEntity_AgeSuitability = 0 | 7 | 13 | 18
export type RepositoryEntity_SystemWideOperationId = SystemWideOperationId

@MappedSuperclass()
export abstract class RepositoryEntity
	extends Stageable {

	@Id()
	@ManyToOne()
	@JoinColumn({
		name: 'REPOSITORY_ID', referencedColumnName: 'ID',
		nullable: false
	})
	repository: Repository

	@Id()
	@ManyToOne()
	@JoinColumn({
		name: 'ACTOR_ID', referencedColumnName: 'ID',
		nullable: false
	})
	actor: Actor

	@Id()
	@Column({name: 'ACTOR_RECORD_ID', nullable: false})
	@GeneratedValue()
	actorRecordId: RepositoryEntity_ActorRecordId

	@Column({name: 'AGE_SUITABILITY', nullable: false})
	@DbNumber()
	ageSuitability: RepositoryEntity_AgeSuitability

	// This field is local to the device only, when copied to new device this value is re-created
	@Column({name: 'SYSTEM_WIDE_OPERATION_ID', nullable: false})
	systemWideOperationId: RepositoryEntity_SystemWideOperationId

	/*
		@OneToMany()
		@SubQuery((
			re: QRepositoryEntity,
			oh: QOperationHistory,
			join: Function
			db: IAirportDatabase,
			f: FunctionsAndOperators,
			opFields = DUO.getAllFieldsSelect(oh.__driver__.dbEntity),
			rh: QRecordHistory,
			rth: QRepositoryTransactionHistory
		) =>
			join({
				select: {
					...opFields,
					recordHistory: {
						id: Y,
						actorRecordId: Y,
						oldValues: {}
					},
					repositoryTransactionHistory: {
						syncTimestamp: Y,
						saveTimestamp: Y,
						syncStatus: Y,
						transactionHistory: {}
					}
				},
				from: [
					rh = oh.recordHistory.innerJoin(),
					rth = oh.repositoryTransactionHistory.innerJoin(),
				],
				where: f.and(
					rh.actorRecordId.equals(re.actorRecordId),
					oh.application.index.equals(re.__driver__.dbEntity.application.index),
					oh.entity.index.equals(re.__driver__.dbEntity.table.index),
					rth.repository.id.equals(re.repository.id),
					rth.actor.id.equals(re.actor.id)
				),
				orderBy: [
					rth.syncTimestamp.asc(),
					rth.saveTimestamp.asc(),
					oh.orderNumber.asc()
				]
			}).on((history: OperationHistory) => f.and(
				re.repository.id.equals(history.repositoryTransactionHistory.repository.id),
				re.actor.id.equals(history.repositoryTransactionHistory.actor.id),
				re.actorRecordId.equals(history.recordHistory.actorRecordId),
			))
		)
		history: OperationHistory[];
	*/

}
