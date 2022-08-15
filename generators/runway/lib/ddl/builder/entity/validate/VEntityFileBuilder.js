import { resolveRelativeEntityPath, resolveRelativePath, } from '../../../../resolve/pathResolver';
import { FileBuilder } from '../FileBuilder';
import { IVEntityInterfaceBuilder } from './IVEntityInterfaceBuilder';
import { VEntityBuilder } from './VEntityBuilder';
/**
 * Created by Papa on 4/26/2016.
 */
export class VEntityFileBuilder extends FileBuilder {
    constructor(entity, fullGenerationPath, pathBuilder, entityMapByName, configuration, sIndexedEntity, entityPath) {
        super(entity, fullGenerationPath, pathBuilder, configuration);
        this.entityMapByName = entityMapByName;
        this.entityPath = entityPath;
        this.importMap = {};
        this.vEntityBuilder = new VEntityBuilder(entity, fullGenerationPath, pathBuilder.workingDirPath, this, entityMapByName, sIndexedEntity);
        this.vEntityInterfaceBuilder = new IVEntityInterfaceBuilder(entity, this.vEntityBuilder);
        this.addImport([
            'IEntityVDescriptor',
            'IVBooleanField',
            'IVDateField',
            'IVNumberField',
            'IVStringField',
            'IVUntypedField'
        ], '@airbridge/validate');
        // let entityRelativePath = resolveRelativePath(fullGenerationPath, entity.path);
        // console.log('Entity: ' + entity.path)
        if (entity.parentEntity) {
            let parentVEntityRelativePath;
            if (entity.parentEntity.project) {
                parentVEntityRelativePath = entity.parentEntity.project + '/lib/to_be_generated/runtime-index';
            }
            else {
                let parentFullGenerationPath = pathBuilder.getFullPathToGeneratedSource(entity.parentEntity.path, 'v');
                parentVEntityRelativePath = resolveRelativePath(fullGenerationPath, parentFullGenerationPath);
            }
            let parentEntityType = entity.parentEntity.type;
            this.addImport([
                `${parentEntityType}VDescriptor`
            ], parentVEntityRelativePath);
        }
    }
    build() {
        let interfaceSource = this.vEntityInterfaceBuilder.build();
        let imports = this.buildImports();
        let fileSource = `${imports}

${interfaceSource}
`;
        return fileSource;
    }
    addRelationImports(relationBuilders) {
        relationBuilders.forEach((builder) => {
            let property = builder.entityProperty;
            let type = property.type;
            let vEntityRelativePath = property.fromProject + '/lib/to_be_generated/runtime-index';
            if (property.fromProject) {
                type = property.otherApplicationDbEntity.name;
            }
            else {
                type = property.entity.type;
                if (this.entity !== property.entity) {
                    vEntityRelativePath = resolveRelativeEntityPath(this.entity, property.entity);
                    vEntityRelativePath = vEntityRelativePath.replace('.ts', '');
                    vEntityRelativePath = this.pathBuilder.prefixToFileName(vEntityRelativePath, 'v');
                }
            }
            type = type.replace('[]', '');
            if (this.entity !== property.entity) {
                // console.log(vEntityRelativePath)
                this.addImport([type + 'VDescriptor'], vEntityRelativePath);
            }
            if (property.fromProject) {
                let relationEntityPath = property.fromProject;
                this.addImport([type], relationEntityPath + '/lib/to_be_generated/runtime-index', false);
            }
            else {
                const entityFilePath = this.pathBuilder.getFullPathToDdlSource(this.entityMapByName[type].path);
                let entityInterfaceRelativePath = resolveRelativePath(this.fullGenerationPath, entityFilePath);
                entityInterfaceRelativePath = entityInterfaceRelativePath.replace('.ts', '');
                this.addImport([type], entityInterfaceRelativePath, false);
            }
        });
    }
    addImports() {
        this.addRelationImports(this.vEntityBuilder.idRelationBuilders);
        this.addRelationImports(this.vEntityBuilder.nonIdRelationBuilders);
        // const entityImportRelativePath = resolveRelativePath(this.fullGenerationPath,
        //   this.entityPath).replace('.ts', '');
        // this.addImport([this.entity.docEntry.name], entityImportRelativePath, false);
        const vFilePath = this.pathBuilder.getFullPathToGeneratedSource(this.entity.path, 'v');
        let entityInterfaceRelativePath = resolveRelativePath(vFilePath, this.fullGenerationPath);
        entityInterfaceRelativePath = entityInterfaceRelativePath.replace('.ts', '').toLowerCase();
        this.addImport([
            'I' + this.entity.docEntry.name
        ], entityInterfaceRelativePath);
    }
}
//# sourceMappingURL=VEntityFileBuilder.js.map