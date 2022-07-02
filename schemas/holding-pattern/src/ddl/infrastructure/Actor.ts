import {
	Column,
	DbNumber,
	DbString,
	Entity,
	GeneratedValue,
	Id,
	JoinColumn,
	ManyToOne,
} from '@airport/air-traffic-control'
import {
	Client,
	Terminal,
	User
} from '@airport/travel-document-checkpoint'
import { Application } from '@airport/airspace';

export type Actor_Id = number;
export type Actor_GUID = string;

@Entity()
export class Actor {

	@Id()
	@GeneratedValue()
	@DbNumber()
	@Column({ name: 'ID' })
	id?: Actor_Id

	@Column({ name: 'GUID', nullable: false })
	@DbString()
	GUID?: Actor_GUID

	@ManyToOne()
	@JoinColumn({
		name: 'USER_ID', referencedColumnName: 'ID',
		nullable: false
	})
	user: User

	@ManyToOne()
	@JoinColumn({
		name: 'TERMINAL_ID', referencedColumnName: 'ID',
		nullable: false
	})
	terminal?: Terminal

	@ManyToOne()
	@JoinColumn({ name: "APPLICATION_INDEX", referencedColumnName: "APPLICATION_INDEX" })
	application?: Application

	@ManyToOne()
	@JoinColumn({
		name: 'CLIENT_ID', referencedColumnName: 'ID',
		nullable: true
	})
	client?: Client

}
