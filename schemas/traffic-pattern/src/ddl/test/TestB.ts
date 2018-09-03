import {
	Column,
	Entity,
	Id,
	JoinColumns,
	ManyToOne,
	Table
}              from '@airport/air-control'
import {TestA} from './TestA'

// TODO: add support for TS interfaces on non-id based relations
@Entity()
@Table({name: 'TEST_B'})
export class TestB {

	@Id()
	idBOne: number

	@ManyToOne()
	@JoinColumns([
		{name: 'B_A_TWO', referencedColumnName: 'A_TWO'},
		{name: 'B_A_THREE', referencedColumnName: 'A_THREE'},
	])
	bToA: TestA

	@Column({name: 'B_FOUR'})
	bFour: number
}