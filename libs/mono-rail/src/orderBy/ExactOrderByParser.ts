import { JSONFieldInOrderBy, SortOrder } from "../../../../apis/ground-control/lib/index";
import { IValidator }                    from "../../../../apps/terminal/src/validation/Validator";
import { INonEntityOrderByParser }       from "./AbstractEntityOrderByParser";

/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
export class ExactOrderByParser implements INonEntityOrderByParser {

	constructor(private validator: IValidator) {
	}

	getOrderByFragment(
		rootSelectClauseFragment: any,
		orderBy: JSONFieldInOrderBy[]
	): string {
		return orderBy.map(
			(orderByField) => {
				this.validator.validateAliasedFieldAccess(orderByField.fa);
				switch (orderByField.so) {
					case SortOrder.ASCENDING:
						return `${orderByField.fa} ASC`;
					case SortOrder.DESCENDING:
						return `${orderByField.fa} DESC`;
				}
			}).join(', ');
	}

}