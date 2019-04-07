import {
	Column,
	MappedSuperclass
} from '@airport/air-control'

export type Stageable_Draft = boolean

@MappedSuperclass()
export abstract class Stageable {

	@Column({name: 'IS_DRAFT', nullable: false})
	draft: Stageable_Draft

}