import {
	Column,
	Entity,
	Id,
	JoinColumns,
	ManyToOne,
	Table
}              from '@airport/air-control'
import {TestB} from './TestB'

// TODO: add support for TS interfaces on non-id based relations
@Entity()
@Table({name: 'TEST_C'})
export class TestC {

	@Id()
	idCOne: number

	@ManyToOne()
	@JoinColumns([
		{name: 'C_A_TWO', referencedColumnName: 'B_A_TWO'},
		{name: 'C_A_THREE', referencedColumnName: 'B_A_THREE'},
		{name: 'C_B_FOUR', referencedColumnName: 'B_FOUR'},
	])
	cToB: TestB

	@Column({name: 'C_FIVE'})
	cFive: number
}