import { PathBuilder } from './PathBuilder';
import { UtilityBuilder } from './UtilityBuilder';

export class DaoBuilder
	extends UtilityBuilder {

	constructor(
		applicationFullName: string,
		pathBuilder: PathBuilder
	) {
		super(applicationFullName, pathBuilder, 'Dao');
	}

	protected addImports() {
		super.addImports();
		this.addImport([
			'DaoQueryDecorators',
			'IDao'
		], '@airport/tarmaq-dao');
	}

	protected buildStaticProperties(
		entityName: string
	): string {
		return `
	
	static Find      = new DaoQueryDecorators<${entityName}ESelect>();
	static FindOne   = new DaoQueryDecorators<${entityName}ESelect>();
	static Search    = new DaoQueryDecorators<${entityName}ESelect>();
	static SearchOne = new DaoQueryDecorators<${entityName}ESelect>();
	static Save(
		config: ${entityName}Graph
	): PropertyDecorator {
		return Dao.BaseSave<${entityName}Graph>(config);
  }`;
	}

}
