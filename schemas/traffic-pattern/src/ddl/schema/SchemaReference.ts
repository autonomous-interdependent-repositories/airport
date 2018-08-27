import {
	Entity,
	Id,
	JoinColumn,
	ManyToOne,
	Table
}                             from "@airport/air-control";
import {SchemaReferenceIndex} from '@airport/ground-control'
import {SchemaVersion}        from "./SchemaVersion";

@Entity()
@Table({
	name: "SCHEMA_REFERENCES"
})
export class SchemaReference {

	@Id()
	@ManyToOne()
	@JoinColumn({name: "OWN_SCHEMA_VERSION_ID", referencedColumnName: "ID"})
	ownSchemaVersion: SchemaVersion;

	@Id()
	@ManyToOne()
	@JoinColumn({name: "REFERENCED_SCHEMA_VERSION_ID", referencedColumnName: "ID"})
	referencedSchemaVersion: SchemaVersion;

	index: SchemaReferenceIndex;

}