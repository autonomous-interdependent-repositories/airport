import {
	Column,
	Entity,
	Id,
	Table
} from '@airport/air-control'

// TODO: add support for TS interfaces on non-id based relations
@Entity()
@Table({name: 'TEST_A'})
export class TestA {

	@Id()
	idAOne: number;

	@Column({name: 'A_TWO'})
	aTwo: number;

	@Column({name: 'A_THREE'})
	aThree: number;
}