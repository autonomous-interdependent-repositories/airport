import {
	IEntityVDescriptor,
	IVBooleanField,
	IVDateField,
	IVNumberField,
	IVStringField,
	IVUntypedField,
} from '@airbridge/validate';
import {
	TypeClassificationVDescriptor,
} from './VTypeClassification';
import {
	TypeClassification,
} from '../../../ddl/type/TypeClassification';
import {
	IType,
} from '../../entity/type/IType';



////////////////////
//  API INTERFACE //
////////////////////

export interface TypeVDescriptor<T>
    extends IEntityVDescriptor<T> {
	// Id Properties
	id?: number | IVNumberField;
	
	// Non-Id Properties
	name?: string | IVStringField;

	// Id Relations - full property interfaces

  // Non-Id relations (including OneToMany's)
	typeClassifications?: TypeClassificationVDescriptor<TypeClassification>

}

