import {
	Column,
	DbBoolean,
	DbNumber,
	DbString,
	Entity,
	GeneratedValue,
	Id,
	JoinColumn,
	ManyToOne,
	Table
} from '@airport/air-traffic-control'
import { User } from './User'

export type TmTerminal_Id = number;
export type Terminal_IsLocal = boolean;
export type Terminal_GUID = string;

/**
 * 
 * DEPRECATED - syncing will now be done via IPFS/Peergos
 * 
 */
@Entity()
@Table({
	name: 'TERMINAL',
	indexes: (t: Terminal) => [{
		property: t.GUID,
		unique: true
	}]
})
export class Terminal {

	@Id()
	@GeneratedValue()
	@DbNumber()
	id: TmTerminal_Id

	@Column({ name: 'GUID', nullable: false })
	@DbString()
	GUID: Terminal_GUID

	@ManyToOne()
	@JoinColumn({ name: 'OWNER_USER_ID', referencedColumnName: 'ID' })
	owner: User

	@Column({ name: 'IS_LOCAL', nullable: false })
	@DbBoolean()
	isLocal: Terminal_IsLocal = false

}
