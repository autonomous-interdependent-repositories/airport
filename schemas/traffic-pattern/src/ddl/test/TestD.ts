import {
	Column,
	Entity,
	Id,
	Table
} from '@airport/air-control'

// TODO: add support for TS interfaces on non-id based relations
@Entity()
@Table({name: 'TEST_D'})
export class TestD {

	@Id()
	@Column({name: 'D_ONE'})
	dOne: number

	@Id()
	@Column({name: 'D_TWO'})
	dTwo: number

	@Column({name: 'D_THREE'})
	dThree: number
}